// src/engine/stats.ts

import type { Build, StatMap, Item, EnemyProfile } from '../types/build';
import type { DerivedStats, DefenseSummary, OffenseSummary } from '../types/derived';
import { CLASS_BASE_STATS } from '../data/classes';
import { getEnemyById } from '../data/enemies';
import { computeDamagePerHit } from './damage';
import type { HitContext } from '../types/combat';


/**
 * Utility: add two StatMaps together.
 * For each stat key, we sum the values from `a` and `b`.
 *
 * In functional programming terms, this is a "reducer" that merges two maps.
 */
export function addStatMaps(a: StatMap, b: StatMap): StatMap {
  const result: StatMap = { ...a };
  for (const [key, value] of Object.entries(b)) {
    const statKey = key as keyof StatMap;
    const existing = result[statKey] ?? 0;
    result[statKey] = existing + (value ?? 0);
  }
  return result;
}

/**
 * Aggregates all stat sources:
 * - class base stats (from data)
 * - build.baseStats (user-adjusted)
 * - stat bonuses from all equipped items
 * - stat bonuses from perks
 * - stat bonuses from active status effects
 */
export function computeCombinedStats(build: Build): StatMap {
  const classBase = CLASS_BASE_STATS[build.classId] ?? {};
  let combined: StatMap = {};

  // Start with class base
  combined = addStatMaps(combined, classBase);

  // Add build-specific base stats (manual overrides, if any)
  combined = addStatMaps(combined, build.baseStats);

  // Add from equipped items
  Object.values(build.equippedItems).forEach((item) => {
    if (!item) return;
    if (item.statBonuses) {
      combined = addStatMaps(combined, item.statBonuses);
    }
  });

  // Add from perks
  build.perks.forEach((perk) => {
    if (perk.statBonuses) {
      combined = addStatMaps(combined, perk.statBonuses);
    }
  });

  // Add from active status effects
  build.activeStatusEffects.forEach((effect) => {
    if (effect.statBonuses) {
      combined = addStatMaps(combined, effect.statBonuses);
    }
  });

  return combined;
}

/**
 * Compute a simple DefenseSummary.
 * - HP is based on combinedStats.health
 * - ArmorRating = sum of baseArmor from equipped items
 * - Effective HP is a placeholder using a simple armor formula
 */
export function computeDefenseSummary(build: Build, combinedStats: StatMap): DefenseSummary {
  const hitPoints = combinedStats.health ?? 0;

  // Sum up all armor from equipped items
  let armorRating = 0;
  Object.values(build.equippedItems).forEach((item: Item | undefined) => {
    if (!item?.baseArmor) return;
    armorRating += item.baseArmor;
  });

  /**
   * Very rough EHP approximation:
   *   damageReduction = armorRating / (armorRating + K)
   *   effectiveHP = hitPoints / (1 - damageReduction)
   *
   * For now, we pick K = 100 as a placeholder. Later you'll match this to the real game math.
   */
  const K = 100;
  const damageReduction = armorRating / (armorRating + K);
  const effectiveHitPoints =
    armorRating > 0 && damageReduction < 1 ? hitPoints / (1 - damageReduction) : hitPoints;

  return {
    hitPoints,
    armorRating,
    effectiveHitPoints,
  };
}

/**
 * Compute a simple OffenseSummary.
 * This now takes an optional enemy and returns DPS vs that enemy as well.
 */
export function computeOffenseSummary(
  build: Build,
  combinedStats: StatMap,
  enemy?: EnemyProfile,
): OffenseSummary {
  const agility = combinedStats.agility ?? 0;

  // Attack speed formula (tunable)
  const baseAps = 1.0;
  const aps = baseAps + agility * 0.01;

  // Basic hit (no headshot, no backstab, etc.)
  const basicContext: HitContext = {
    isHeadshot: false,
    isBackstab: false,
  };

  const damagePerHitPreArmor = computeDamagePerHit(build, undefined, basicContext);
  const damagePerHitVsEnemy   = computeDamagePerHit(build, enemy, basicContext);

  return {
    weaponDamagePerHit: damagePerHitPreArmor,
    attacksPerSecond: aps,
    approxDps: damagePerHitPreArmor * aps,
    dpsVsEnemy: damagePerHitVsEnemy * aps,
  };
}

/**
 * The top-level function: from a Build, compute all derived stats.
 */
export function computeDerivedStats(build: Build): DerivedStats {
  const combinedStats = computeCombinedStats(build);

  // Resolve the currently selected enemy (if any)
  const enemy = getEnemyById(build.targetEnemyId);

  const defense = computeDefenseSummary(build, combinedStats);
  const offense = computeOffenseSummary(build, combinedStats, enemy);

  return {
    combinedStats,
    defense,
    offense,
  };
}