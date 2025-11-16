// src/engine/__tests__/perks.test.ts

import { describe, it, expect } from 'vitest';
import type { Build, Item } from '../../types/build';
import { computeDerivedStats } from '../stats';
import { ENEMIES } from '../../data/enemies';
import { PERKS } from '../../data/perks';

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

function baseBuildWithWeapon(): Build {
  return {
    id: 'perk-test-build',
    name: 'Perk Test Build',
    classId: 'fighter',
    baseStats: {
      strength: 15,
      agility: 10,
      health: 100,
    },
    equippedItems: {
      weaponMain: dummyWeapon,
    },
    perks: [],
    activeStatusEffects: [],
    targetEnemyId: ENEMIES[1]?.id,
  };
}

describe('Perk damage multipliers', () => {
  it('Mighty Strikes increases physical DPS', () => {
    const baseBuild = baseBuildWithWeapon();
    const base = computeDerivedStats(baseBuild);

    const mightyStrikes = PERKS.find((p) => p.id === 'mighty-strikes');
    expect(mightyStrikes).toBeDefined();

    const withPerk: Build = {
      ...baseBuild,
      perks: mightyStrikes ? [mightyStrikes] : [],
    };

    const boosted = computeDerivedStats(withPerk);

    expect(boosted.offense.dpsVsEnemy).toBeGreaterThan(
      base.offense.dpsVsEnemy,
    );
  });
});
