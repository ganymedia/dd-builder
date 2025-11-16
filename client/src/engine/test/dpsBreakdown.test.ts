// src/engine/test/dpsBreakdown.test.ts

import { describe, it, expect } from 'vitest';
import type { Item } from '../../types/build';
import { computeDerivedStats } from '../stats';
import { BuildBuilder } from '../../test-utils/builders';
import { ENEMIES } from '../../data/enemies';

const headshotWeapon: Item = {
  id: 'test-bow',
  name: 'Test Bow',
  slot: 'weaponMain',
  rarity: 'common',
  baseWeaponDamage: 20,
  weaponDamageType: 'physical',
  strengthScaling: 0,
  agilityScaling: 0.5,
  headshotMultiplier: 2.0,
  tags: ['weapon', 'bow'],
};

describe('DPS breakdown (body vs headshot)', () => {
  it('headshot DPS should be higher than body DPS when weapon has headshot multiplier', () => {
    const build = new BuildBuilder()
      .withEquippedItem('weaponMain', headshotWeapon)
      .withBaseStats({ agility: 15 })
      .withTargetEnemyId(ENEMIES[0]?.id)
      .build();

    const derived = computeDerivedStats(build);
    const { offense } = derived;

    expect(offense.headshotDps).toBeGreaterThan(offense.bodyDps);
    expect(offense.headshotDpsVsEnemy).toBeGreaterThan(
      offense.bodyDpsVsEnemy,
    );
  });
});
