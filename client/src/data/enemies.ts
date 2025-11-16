// src/data/enemies.ts

import type { EnemyProfile } from '../types/build';
import rawEnemies from './patches/0.1.0/enemies.json';

/**
 * Enemy profiles for the current patch.
 */
export const ENEMIES: EnemyProfile[] = rawEnemies as EnemyProfile[];

/**
 * Helper function to find a profile by ID.
 */
export function getEnemyById(id: string | undefined): EnemyProfile | undefined {
  if (!id) return undefined;
  return ENEMIES.find((e) => e.id === id);
}
