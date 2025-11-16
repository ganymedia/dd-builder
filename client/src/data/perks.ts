// src/data/perks.ts

import type { Perk } from '../types/build';

/**
 * Example perk data.
 * In a real project, you'll generate this from external data or keep a patch-specific file.
 */
export const PERKS: Perk[] = [
  {
    id: 'mighty-strikes',
    name: 'Mighty Strikes',
    description: 'Increases physical weapon damage by 10%.',
    physicalDamageMultiplier: 1.10,
    appliesToDamageType: 'physical',
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Increases headshot damage with bows by 25%.',
    headshotDamageMultiplier: 1.25,
    appliesToWeaponTag: 'bow',
  },
  {
    id: 'thick-skin',
    name: 'Thick Skin',
    description: 'Grants +20 health.',
    statBonuses: {
      health: 20,
    },
  },
];

/**
 * Helper to look up a perk by ID.
 */
export function getPerkById(id: string | undefined): Perk | undefined {
  if (!id) return undefined;
  return PERKS.find((p) => p.id === id);
}
