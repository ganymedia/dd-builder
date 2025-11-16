// src/test-utils/builders.ts

import type {
  Build,
  ClassId,
  Item,
  ItemSlot,
  Perk,
  StatMap,
} from '../types/build';
import { ENEMIES } from '../data/enemies';

/**
 * A small helper to deep-ish clone simple objects.
 * For our Build objects this is fine since it's mostly plain data.
 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Fluent builder for Build objects, so tests can quickly spin up realistic cases.
 */
export class BuildBuilder {
  private _build: Build;

  constructor() {
    const baseStats: StatMap = {
      strength: 10,
      agility: 10,
      will: 10,
      knowledge: 10,
      health: 100,
      resource: 0,
    };

    this._build = {
      id: 'test-build',
      name: 'Test Build',
      classId: 'fighter',
      baseStats,
      equippedItems: {},
      perks: [],
      activeStatusEffects: [],
      targetEnemyId: ENEMIES[0]?.id,
    };
  }

  withId(id: string): this {
    this._build.id = id;
    return this;
  }

  withName(name: string): this {
    this._build.name = name;
    return this;
  }

  withClass(classId: ClassId): this {
    this._build.classId = classId;
    return this;
  }

  withBaseStats(stats: Partial<StatMap>): this {
    this._build.baseStats = {
      ...this._build.baseStats,
      ...stats,
    };
    return this;
  }

  withEquippedItem(slot: ItemSlot, item: Item): this {
    this._build.equippedItems = {
      ...this._build.equippedItems,
      [slot]: item,
    };
    return this;
  }

  withPerks(perks: Perk[]): this {
    this._build.perks = [...perks];
    return this;
  }

  withTargetEnemyId(id: string | undefined): this {
    this._build.targetEnemyId = id;
    return this;
  }

  /**
   * Finalize and return a cloned Build object
   * so tests don't accidentally share mutable state.
   */
  build(): Build {
    return clone(this._build);
  }
}

/**
 * Convenience function if you don't need fluent chaining.
 */
export function createBaseBuild(overrides?: Partial<Build>): Build {
  const builder = new BuildBuilder();
  const base = builder.build();
  return {
    ...base,
    ...overrides,
    baseStats: {
      ...base.baseStats,
      ...(overrides?.baseStats ?? {}),
    },
    equippedItems: {
      ...base.equippedItems,
      ...(overrides?.equippedItems ?? {}),
    },
    perks: overrides?.perks ?? base.perks,
    activeStatusEffects: overrides?.activeStatusEffects ?? base.activeStatusEffects,
  };
}
