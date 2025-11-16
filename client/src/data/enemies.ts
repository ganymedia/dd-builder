// src/data/enemies.ts

import type { EnemyProfile } from '../types/build';

/**
 * Basic enemy profiles used for DPS calculations.
 * You can expand this list with common PvE enemies or PvP archetypes.
 */
export const ENEMIES: EnemyProfile[] = [
  {
    id: 'dummy-light',
    name: 'Training Dummy (Light Armor)',
    maxHealth: 100,
    armorRating: 10,
  },
  {
    id: 'dummy-medium',
    name: 'Training Dummy (Medium Armor)',
    maxHealth: 120,
    armorRating: 40,
  },
  {
    id: 'dummy-heavy',
    name: 'Training Dummy (Heavy Armor)',
    maxHealth: 140,
    armorRating: 70,
  },
];

/**
 * Helper function to find a profile by ID.
 */
export function getEnemyById(id: string | undefined): EnemyProfile | undefined {
  if (!id) return undefined;
  return ENEMIES.find((e) => e.id === id);
}

