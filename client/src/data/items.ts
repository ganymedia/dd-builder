// src/data/items.ts

import type { Item, ItemSlot } from '../types/build';

/**
 * In a real app, you'll generate this from scraped/API data.
 * For now, we hand-craft a few example items so we can exercise the engine.
 */
export const ITEMS: Item[] = [
  {
    id: 'longsword-common',
    name: 'Common Longsword',
    slot: 'weaponMain',
    rarity: 'common',
    baseWeaponDamage: 35,
    statBonuses: {
      strength: 1,
    },
    tags: ['weapon', 'sword', 'melee'],
  },
  {
    id: 'rusty-helmet',
    name: 'Rusty Helmet',
    slot: 'helmet',
    rarity: 'common',
    baseArmor: 10,
    statBonuses: {
      health: 5,
    },
    tags: ['armor', 'plate'],
  },
  {
    id: 'leather-boots',
    name: 'Leather Boots',
    slot: 'boots',
    rarity: 'common',
    baseArmor: 5,
    tags: ['armor', 'leather'],
  },
];

/**
 * Helper that returns all items that can be equipped in a given slot.
 * This is basically a filter over the global ITEMS array.
 */
export function getItemsForSlot(slot: ItemSlot): Item[] {
  return ITEMS.filter((item) => item.slot === slot);
}

/**
 * Helper to look up a single item by ID.
 * Useful when we store only the ID and need the full object, or vice versa.
 */
export function getItemById(id: string | undefined): Item | undefined {
  if (!id) return undefined;
  return ITEMS.find((item) => item.id === id);
}
