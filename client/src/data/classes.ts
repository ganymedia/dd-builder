// src/data/classes.ts

import type { ClassId, StatMap } from '../types/build';

/**
 * Base stats per class.
 * These are placeholder values for now and can be adjusted
 * once you have real data from the wiki/API.
 */
export const CLASS_BASE_STATS: Record<ClassId, StatMap> = {
  fighter: {
    strength: 14,
    agility: 12,
    will: 8,
    knowledge: 8,
    health: 100,
    resource: 0,
  },
  barbarian: {
    strength: 18,
    agility: 10,
    will: 8,
    knowledge: 6,
    health: 120,
    resource: 0,
  },
  ranger: {
    strength: 10,
    agility: 16,
    will: 8,
    knowledge: 8,
    health: 90,
    resource: 0,
  },
  wizard: {
    strength: 6,
    agility: 10,
    will: 16,
    knowledge: 14,
    health: 80,
    resource: 0,
  },
  cleric: {
    strength: 10,
    agility: 10,
    will: 16,
    knowledge: 10,
    health: 95,
    resource: 0,
  },
  rogue: {
    strength: 10,
    agility: 18,
    will: 6,
    knowledge: 8,
    health: 85,
    resource: 0,
  },
};

