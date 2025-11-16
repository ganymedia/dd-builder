// src/components/GearPanel.tsx

import type React from 'react';
import type { Build, ItemSlot } from '../types/build';
import { getItemsForSlot } from '../data/items';
import { PERKS } from '../data/perks';

interface GearPanelProps {
  build: Build;
  onEquipItem: (slot: ItemSlot, itemId: string | null) => void;
  onTogglePerk: (perkId: string) => void;
}

/**
 * Display labels for each item slot.
 */
const SLOT_LABELS: { slot: ItemSlot; label: string }[] = [
  { slot: 'weaponMain', label: 'Weapon (Main Hand)' },
  { slot: 'weaponOff', label: 'Weapon (Off Hand)' },
  { slot: 'helmet', label: 'Helmet' },
  { slot: 'chest', label: 'Chest' },
  { slot: 'gloves', label: 'Gloves' },
  { slot: 'boots', label: 'Boots' },
  { slot: 'ring1', label: 'Ring 1' },
  { slot: 'ring2', label: 'Ring 2' },
  { slot: 'necklace', label: 'Necklace' },
];

export function GearPanel({ build, onEquipItem, onTogglePerk }: GearPanelProps) {
  /**
   * Handle item selection for a given slot.
   */
  const handleSelectChange = (
    slot: ItemSlot,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    onEquipItem(slot, value === '' ? null : value);
  };

  /**
   * Returns true if a perk with perkId is currently selected on the build.
   */
  const isPerkSelected = (perkId: string): boolean =>
    build.perks.some((p) => p.id === perkId);

  /**
   * Toggle a perk on/off.
   * We don't actually need the event object, so we omit it to avoid the
   * "declared but never read" warning.
   */
  const handlePerkCheckboxChange = (perkId: string) => {
    onTogglePerk(perkId);
  };

  return (
    <div>
      <h2>Gear</h2>
      <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
        Select items for each slot. The stats panel will update automatically as you equip gear.
      </p>

      {/* Gear slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {SLOT_LABELS.map(({ slot, label }) => {
          const equippedItem = build.equippedItems[slot];
          const itemsForSlot = getItemsForSlot(slot);

          return (
            <div key={slot}>
              <label style={{ fontSize: '0.9rem' }}>
                {label}:{' '}
                <select
                  value={equippedItem?.id ?? ''}
                  onChange={(event) => handleSelectChange(slot, event)}
                >
                  <option value="">(none)</option>
                  {itemsForSlot.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} [{item.rarity}]
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
      </div>

      <hr style={{ margin: '0.75rem 0' }} />

      {/* Perks */}
      <h3>Perks</h3>
      <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
        Enable or disable perks to see their impact on stats and damage.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {PERKS.map((perk) => (
          <label key={perk.id} style={{ fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={isPerkSelected(perk.id)}
              onChange={() => handlePerkCheckboxChange(perk.id)}
            />{' '}
            <strong>{perk.name}</strong> – {perk.description}
          </label>
        ))}
      </div>
    </div>
  );
}