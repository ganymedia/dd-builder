// src/types/combat.ts

/**
 * Context for how a hit is being made.
 * Later you will support:
 * - headshot
 * - backstab
 * - weakpoint
 * - skill-based attacks
 * - charged attacks
 */
export interface HitContext {
  isHeadshot?: boolean;
  isBackstab?: boolean;
  isStealthAttack?: boolean;

  /** Future-proof: which attack type */
  attackType?: 'basic' | 'charged' | 'special';
}
