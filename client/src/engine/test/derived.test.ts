// src/engine/__tests__/derived.test.ts

import { describe, it, expect } from 'vitest';
import type { Build, Item } from '../../types/build';
import { computeDerivedStats } from '../stats';
import { ENEMIES } from '../../data/enemies';

const dummyWeapon: Item = {
  id: 'test-sword',
  name: 'Test Sword',
  slot: 'weaponMain',
  rarity: 'common',
  baseWeaponDamage: 30,
  weaponDamageType: 'physical',
  strengthScaling: 0.5,
  tags: ['weapon', 'sword'],
};

const dummyArmor: Item = {
  id: 'test-armor',
  name: 'Test Armor',
  slot: 'chest',
  rarity: 'common',
  baseArmor: 50,
};

function createBaseBuild(): Build {
  return {
    id: 'test-build',
    name: 'Test Build',
    classId: 'fighter',
    baseStats: {
      strength: 15,
      agility: 10,
      health: 100,
    },
    equippedItems: {},
    perks: [],
    activeStatusEffects: [],
    targetEnemyId: ENEMIES[1]?.id, // e.g. medium dummy
  };
}

describe('computeDerivedStats', () => {
  it('computes reasonable defense stats without gear', () => {
    const build = createBaseBuild();
    const derived = computeDerivedStats(build);

    expect(derived.defense.hitPoints).toBeGreaterThan(0);
    expect(derived.defense.armorRating).toBe(0);
    // With 0 armor, EHP should equal HP
    expect(derived.defense.effectiveHitPoints).toBeCloseTo(
      derived.defense.hitPoints,
      5,
    );
  });

  it('increases armor and EHP when armor is equipped', () => {
    const build = createBaseBuild();
    build.equippedItems.chest = dummyArmor;

    const derived = computeDerivedStats(build);

    expect(derived.defense.armorRating).toBeGreaterThan(0);
    expect(derived.defense.effectiveHitPoints).toBeGreaterThan(
      derived.defense.hitPoints,
    );
  });

  it('increases DPS when a weapon is equipped', () => {
    const buildNoWeapon = createBaseBuild();
    const baseDerived = computeDerivedStats(buildNoWeapon);

    const buildWithWeapon = createBaseBuild();
    buildWithWeapon.equippedItems.weaponMain = dummyWeapon;

    const derivedWithWeapon = computeDerivedStats(buildWithWeapon);

    expect(derivedWithWeapon.offense.approxDps).toBeGreaterThan(
      baseDerived.offense.approxDps,
    );
    expect(derivedWithWeapon.offense.dpsVsEnemy).toBeGreaterThan(0);
  });
});
