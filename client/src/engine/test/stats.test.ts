// src/engine/__tests__/stats.test.ts

import { describe, it, expect } from 'vitest';
import type { StatMap } from '../../types/build';
import { addStatMaps } from '../stats';

/**
 * These tests verify that addStatMaps correctly:
 * - Sums overlapping stats
 * - Keeps non-overlapping stats
 * - Handles undefined/null values
 */
describe('addStatMaps', () => {
  it('sums overlapping stats and preserves non-overlapping ones', () => {
    const a: StatMap = { strength: 10, agility: 5 };
    const b: StatMap = { strength: 2, health: 50 };

    const result = addStatMaps(a, b);

    expect(result.strength).toBe(12); // 10 + 2
    expect(result.agility).toBe(5);   // unchanged
    expect(result.health).toBe(50);   // new
  });

  it('treats undefined values as 0', () => {
    const a: StatMap = { strength: 10 };
    const b: StatMap = { strength: undefined };

    const result = addStatMaps(a, b);
    expect(result.strength).toBe(10);
  });

  it('handles empty maps gracefully', () => {
    const a: StatMap = {};
    const b: StatMap = { health: 100 };

    const result = addStatMaps(a, b);
    expect(result.health).toBe(100);
  });
});
