// src/types/derived.ts

import type { StatMap } from './build';

/**
 * Derived defensive stats for a build.
 * This is where we put things like:
 * - total health
 * - effective HP (EHP)
 * - armor, etc.
 */
export interface DefenseSummary {
  /** Raw HP based on base stats + gear + perks, before EHP math */
  hitPoints: number;

  /** Simple flat armor score (we'll refine this later with body/head split, etc.) */
  armorRating: number;

  /**
   * Effective hit points: how much raw damage you can take against a given armor formula.
   * For now, we'll keep this as a placeholder value.
   */
  effectiveHitPoints: number;
}

/**
 * Derived offensive stats.
 * These will eventually include:
 * - damage per hit (body/head)
 * - attacks per second
 * - DPS vs a given enemy profile, etc.
 */
export interface OffenseSummary {
  /** Damage per hit before enemy armor reduction */
  weaponDamagePerHit: number;
  /** Attacks per second */
  attacksPerSecond: number;
  /** Simple DPS before armor */
  approxDps: number;
  /** DPS against the current target enemy, taking armor into account */
  dpsVsEnemy: number;
}
/**
 * The full derived stats set we might want to show in the UI.
 */
export interface DerivedStats {
  combinedStats: StatMap;
  defense: DefenseSummary;
  offense: OffenseSummary;
}