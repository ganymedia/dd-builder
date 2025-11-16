// src/engine/armor.ts

/**
 * Tunable constants for armor formulas.
 * These will be adjusted once you scrape real formulas or test in game.
 */
export const ARMOR_CONSTANTS = {
  physicalK: 85,   // physical DR curve constant
  magicalK: 65,    // magic tends to mitigate differently
};

/**
 * Generic DR curve:
 *   reduction = armor / (armor + K)
 *
 * K determines how "hard" armor scales.
 */
export function armorMitigation(armor: number, K: number): number {
  if (armor <= 0) return 0;
  return armor / (armor + K);
}

/**
 * Compute damage after armor reduction.
 * Keeps the damage non-negative.
 */
export function applyArmorReduction(
  rawDamage: number,
  armor: number,
  type: 'physical' | 'magical',
): number {
  const K = type === 'physical'
    ? ARMOR_CONSTANTS.physicalK
    : ARMOR_CONSTANTS.magicalK;

  const dr = armorMitigation(armor, K);
  return Math.max(rawDamage * (1 - dr), 0);
}
