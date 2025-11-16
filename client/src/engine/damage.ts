// src/engine/damage.ts

import type { Build } from '../types/build';
import type { HitContext } from '../types/combat';
import type { EnemyProfile } from '../types/build';
import { applyArmorReduction } from './armor';

/**
 * Step 1: Determine raw damage before scaling.
 */
function baseWeaponDamage(build: Build): number {
  const mainWeapon = build.equippedItems.weaponMain;
  if (!mainWeapon) return 5; // bare hands fallback

  return mainWeapon.baseWeaponDamage ?? 5;
}

/**
 * Step 2: Apply stat scaling (STR/AGI/etc.)
 */
function applyScaling(build: Build, rawDamage: number): number {
  const weapon = build.equippedItems.weaponMain;
  if (!weapon) return rawDamage;

  const stats = build.baseStats;

  const strength = stats.strength ?? 0;
  const agility = stats.agility ?? 0;

  const strScale = weapon.strengthScaling ?? 0;
  const agiScale = weapon.agilityScaling ?? 0;

  return (
    rawDamage +
    strength * strScale +
    agility * agiScale
  );
}

/**
 * Step 3: Apply contextual multipliers (headshot, backstab, stealth).
 */
function applyHitContext(
  damage: number,
  weapon: any,
  ctx: HitContext,
): number {
  let result = damage;

  // Headshot
  if (ctx.isHeadshot) {
    const mult = weapon?.headshotMultiplier ?? 1.5;
    result *= mult;
  }

  // Backstab (placeholder)
  if (ctx.isBackstab) {
    result *= 1.3;
  }

  // Stealth (placeholder)
  if (ctx.isStealthAttack) {
    result *= 1.5;
  }

  return result;
}

/**
 * Step 4: Apply armor reduction (enemy defenses).
 */
function applyEnemyArmor(
  damage: number,
  enemy: EnemyProfile | undefined,
  damageType: 'physical' | 'magical',
): number {
  if (!enemy) return damage;
  const armor = enemy.armorRating ?? 0;
  return applyArmorReduction(damage, armor, damageType);
}

/**
 * Determine whether a perk applies to this attack, based on:
 * - damageType (physical/magical)
 * - weapon tags (e.g. 'bow', 'dagger')
 */
function perkAppliesToAttack(
  perk: import('../types/build').Perk,
  damageType: 'physical' | 'magical',
  weaponTags: string[],
): boolean {
  // Damage type condition
  if (perk.appliesToDamageType && perk.appliesToDamageType !== 'both') {
    if (perk.appliesToDamageType !== damageType) {
      return false;
    }
  }

  // Weapon tag condition
  if (perk.appliesToWeaponTag) {
    if (!weaponTags.includes(perk.appliesToWeaponTag)) {
      return false;
    }
  }

  return true;
}

/**
 * Apply perk-based damage modifiers.
 */
function applyPerkMultipliers(
  build: Build,
  baseDamage: number,
  damageType: 'physical' | 'magical',
  ctx: HitContext,
  weaponTags: string[],
): number {
  let result = baseDamage;

  for (const perk of build.perks) {
    if (!perkAppliesToAttack(perk, damageType, weaponTags)) continue;

    // Always-on global multiplier
    if (perk.globalDamageMultiplier !== undefined) {
      result *= perk.globalDamageMultiplier;
    }

    // Physical/magical specific
    if (damageType === 'physical' && perk.physicalDamageMultiplier !== undefined) {
      result *= perk.physicalDamageMultiplier;
    }
    if (damageType === 'magical' && perk.magicalDamageMultiplier !== undefined) {
      result *= perk.magicalDamageMultiplier;
    }

    // Contextual multipliers (headshot/backstab)
    if (ctx.isHeadshot && perk.headshotDamageMultiplier !== undefined) {
      result *= perk.headshotDamageMultiplier;
    }
    if (ctx.isBackstab && perk.backstabDamageMultiplier !== undefined) {
      result *= perk.backstabDamageMultiplier;
    }
  }

  return result;
}

/**
 * Top-level function:
 * End-to-end damage calculation pipeline.
 */
export function computeDamagePerHit(
  build: Build,
  enemy: EnemyProfile | undefined,
  ctx: HitContext = {},
): number {
  const weapon = build.equippedItems.weaponMain;
  const damageType = weapon?.weaponDamageType ?? 'physical';
  const weaponTags = weapon?.tags ?? [];

  // step-by-step calculation:
  let dmg = baseWeaponDamage(build);
  dmg = applyScaling(build, dmg);

  // Perks that modify generic damage (pre-headshot/backstab)
  dmg = applyPerkMultipliers(build, dmg, damageType, ctx, weaponTags);

  // Contextual modifiers like headshot / backstab
  dmg = applyHitContext(dmg, weapon, ctx);

  // Final enemy armor reduction
  dmg = applyEnemyArmor(dmg, enemy, damageType);

  return dmg;
}