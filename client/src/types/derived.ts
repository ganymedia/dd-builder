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
  /** Damage per hit before enemy armor (body shot) */
  weaponDamagePerHit: number;

  /** Attacks per second */
  attacksPerSecond: number;

  /** Simple DPS for baseline (body, pre-armor) */
  approxDps: number;

  /** DPS vs selected enemy (body shots) */
  dpsVsEnemy: number;

  /** DPS if we assume body shots only, pre-armor */
  bodyDps: number;

  /** DPS if we assume headshots only, pre-armor */
  headshotDps: number;

  /** DPS if we assume backstabs only, pre-armor */
  backstabDps: number;

  /** DPS vs enemy assuming body shots */
  bodyDpsVsEnemy: number;

  /** DPS vs enemy assuming headshots */
  headshotDpsVsEnemy: number;

  /** DPS vs enemy assuming backstabs */
  backstabDpsVsEnemy: number;
}

/**
 * The full derived stats set we might want to show in the UI.
 */
export interface DerivedStats {
  combinedStats: StatMap;
  defense: DefenseSummary;
  offense: OffenseSummary;
}