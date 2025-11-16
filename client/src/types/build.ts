// src/types/build.ts

/**
 * In TypeScript, "type" and "interface" let us describe shapes of data.
 * - type: often used for unions or aliases
 * - interface: often used for objects with named fields
 *
 * These are erased at compile time; they exist only to help us while coding.
 */

/** Game Version Field
 * Modify whenever version changes for tracking and managing data validity
 */
export type GameVersion = '0.1.0';

/**
 * All the primary stat names we care about.
 * Using a union of string literals gives us strong autocomplete & type safety.
 */
export type StatName =
  | 'strength'
  | 'agility'
  | 'will'
  | 'knowledge'
  | 'health'
  | 'resource'; // e.g. spells, stamina, etc.

/**
 * Supported class IDs, again as a union of literal strings.
 * This can grow over time as you add more classes or subclasses.
 */
export type ClassId =
  | 'fighter'
  | 'barbarian'
  | 'ranger'
  | 'wizard'
  | 'cleric'
  | 'rogue';

/**
 * Item slot types: where an item can be equipped.
 */
export type ItemSlot =
  | 'weaponMain'
  | 'weaponOff'
  | 'helmet'
  | 'chest'
  | 'gloves'
  | 'boots'
  | 'ring1'
  | 'ring2'
  | 'necklace';

/**
 * Rarity is just metadata but often useful for filtering and styling.
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * A map of stat -> value for flat stat bonuses.
 * The `[key in StatName]?` syntax means:
 *   "For each StatName, there may optionally be a numeric value."
 */
export type StatMap = {
  [key in StatName]?: number;
};

/**
 * Base representation of an item.
 * This is your *internal* format – you can always transform external data
 * (e.g., from DarkerDB or a wiki scraper) into this shape.
 */
export interface Item {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: ItemRarity;

  /** Weapon stats */
  baseWeaponDamage?: number;       // raw base damage
  weaponDamageType?: 'physical' | 'magical';
  headshotMultiplier?: number;     // 1.5x, 2.0x, etc.

  /** Damage scaling */
  strengthScaling?: number;        // e.g. 0.5 = 50% of STR added to damage
  agilityScaling?: number;         // e.g. 0.2

  /** Armor/defense-related */
  baseArmor?: number;

  /** Flat stat bonuses */
  statBonuses?: StatMap;

  /** For conditional effects later (e.g. dagger, sword, two-hander) */
  tags?: string[];
}

/**
 * General representation of a status effect (buff/debuff/DoT/etc.).
 * We keep it generic for now; you can refine it as you learn more about the game.
 */
export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'dot' | 'other';
  description: string;

  // Optional duration in seconds; undefined means permanent/always-on while active.
  durationSeconds?: number;

  // Multiplicative modifiers (e.g. +10% weapon damage)
  damageMultiplier?: number;        // 1.10 = +10%
  incomingDamageMultiplier?: number; // 0.90 = -10% damage taken

  // Flat modifiers to stats while effect is active
  statBonuses?: StatMap;
}

/**
 * Perk: always-on modification you choose in your build.
 * Think of this as a "passive node" in PoB terms.
 */
export interface Perk {
  id: string;
  name: string;
  description: string;

  /** Flat stat bonuses (already used in computeCombinedStats) */
  statBonuses?: StatMap;

  /**
   * Generic damage multipliers.
   * These are applied during the damage pipeline if conditions match.
   */
  globalDamageMultiplier?: number;       // applies to all attacks
  physicalDamageMultiplier?: number;     // only physical damage
  magicalDamageMultiplier?: number;      // only magical damage

  /** Contextual multipliers */
  headshotDamageMultiplier?: number;     // extra factor when isHeadshot
  backstabDamageMultiplier?: number;     // extra factor when isBackstab

  /** Simple conditions */
  appliesToDamageType?: 'physical' | 'magical' | 'both';
  appliesToWeaponTag?: string;           // e.g. "sword", "bow", "dagger"
}

/**
 * Representation of a target/enemy profile.
 * Used to calculate DPS vs specific armor/HP levels.
 */
export interface EnemyProfile {
  id: string;
  name: string;
  maxHealth: number;

  // Armor values (you can split head/body/etc later if you like)
  armorRating?: number;
}

/**
 * This interface describes the *entire build*.
 * It is our core entity – all calculations will be based on this.
 */
export interface Build {
  id: string;
  name: string;

  /** Game version this build was created for. */
  gameVersion?: GameVersion;

  classId: ClassId;
  baseStats: StatMap;
  equippedItems: Partial<Record<ItemSlot, Item>>;
  perks: Perk[];
  activeStatusEffects: StatusEffect[];
  targetEnemyId?: string;
}
