// src/data/items.ts

import type { Item, ItemSlot } from '../types/build';
import rawItems from './patches/0.1.0/items.json';

/**
 * Items for the current patch version.
 * Loaded from JSON so we can easily update with real game data later.
 */
export const ITEMS: Item[] = rawItems as Item[];

/**
 * Helper that returns all items that can be equipped in a given slot.
 */
export function getItemsForSlot(slot: ItemSlot): Item[] {
  return ITEMS.filter((item) => item.slot === slot);
}

/**
 * Helper to look up a single item by ID.
 */
export function getItemById(id: string | undefined): Item | undefined {
  if (!id) return undefined;
  return ITEMS.find((item) => item.id === id);
}
