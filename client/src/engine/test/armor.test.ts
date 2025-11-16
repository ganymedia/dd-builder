// src/engine/__tests__/armor.test.ts

import { describe, it, expect } from 'vitest';
import { armorMitigation, applyArmorReduction } from '../armor';

describe('armorMitigation', () => {
  it('returns 0 mitigation for non-positive armor', () => {
    expect(armorMitigation(0, 100)).toBe(0);
    expect(armorMitigation(-10, 100)).toBe(0);
  });

  it('increases with armor and approaches 1 as armor grows', () => {
    const k = 100;
    const lowArmor = armorMitigation(50, k);   // 50 / (50 + 100) = 0.333...
    const equalArmor = armorMitigation(100, k); // 100 / 200 = 0.5
    const highArmor = armorMitigation(300, k);  // 300 / 400 = 0.75

    expect(lowArmor).toBeGreaterThan(0);
    expect(equalArmor).toBeGreaterThan(lowArmor);
    expect(highArmor).toBeGreaterThan(equalArmor);
    expect(highArmor).toBeLessThan(1);
  });
});

describe('applyArmorReduction', () => {
  it('reduces physical damage according to armor', () => {
    const raw = 100;
    const armor = 100;
    const reduced = applyArmorReduction(raw, armor, 'physical');

    // Expect some reduction but not zero or negative
    expect(reduced).toBeLessThan(raw);
    expect(reduced).toBeGreaterThan(0);
  });

  it('does not reduce damage when armor is 0 or negative', () => {
    const raw = 100;
    expect(applyArmorReduction(raw, 0, 'physical')).toBe(raw);
    expect(applyArmorReduction(raw, -10, 'magical')).toBe(raw);
  });
});
