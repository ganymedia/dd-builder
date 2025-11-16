// src/data/perks.ts

import type { Perk } from '../types/build';
import rawPerks from './patches/0.1.0/perks.json';

/**
 * Perks for the current patch version.
 */
export const PERKS: Perk[] = rawPerks as Perk[];

/**
 * Helper to look up a perk by ID.
 */
export function getPerkById(id: string | undefined): Perk | undefined {
  if (!id) return undefined;
  return PERKS.find((p) => p.id === id);
}
