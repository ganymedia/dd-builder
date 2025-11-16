// src/components/__tests__/GearPanel.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Build } from '../../types/build';
import { GearPanel } from '../GearPanel';

// We know we have some items in data, but for tight control we can define one here if needed.
// For now, we'll rely on your existing data/items.ts: it should have longsword-common, etc.

function createEmptyBuild(): Build {
  return {
    id: 'gear-test-build',
    name: 'Gear Test',
    classId: 'fighter',
    baseStats: {
      strength: 10,
      agility: 10,
      health: 100,
    },
    equippedItems: {},
    perks: [],
    activeStatusEffects: [],
  };
}

describe('GearPanel', () => {
  it('calls onEquipItem when selecting a weapon', () => {
    const build = createEmptyBuild();
    const onEquipItem = vi.fn();
    const onTogglePerk = vi.fn();

    render(
      <GearPanel
        build={build}
        onEquipItem={onEquipItem}
        onTogglePerk={onTogglePerk}
      />,
    );

    // Find the main-hand weapon select (by its label text)
    const weaponSelect = screen.getByLabelText(/weapon \(main hand\)/i) as HTMLSelectElement;

    // Select the first non-empty option if available
    // (Assumes you have at least one weaponMain item in data/items.ts)
    const nonEmptyOption = Array.from(weaponSelect.options).find(
      (opt) => opt.value !== '',
    );
    expect(nonEmptyOption).toBeDefined();

    fireEvent.change(weaponSelect, { target: { value: nonEmptyOption!.value } });

    expect(onEquipItem).toHaveBeenCalledTimes(1);
    expect(onEquipItem).toHaveBeenCalledWith('weaponMain', nonEmptyOption!.value);
  });

  it('calls onTogglePerk when a perk is toggled', () => {
    const build = createEmptyBuild();
    const onEquipItem = vi.fn();
    const onTogglePerk = vi.fn();

    render(
      <GearPanel
        build={build}
        onEquipItem={onEquipItem}
        onTogglePerk={onTogglePerk}
      />,
    );

    // Find a perk checkbox by name text (assuming "Mighty Strikes" exists in data/perks.ts)
    const perkCheckbox = screen.getByLabelText(/mighty strikes/i) as HTMLInputElement;
    expect(perkCheckbox).toBeInTheDocument();

    fireEvent.click(perkCheckbox);

    expect(onTogglePerk).toHaveBeenCalledTimes(1);
    expect(onTogglePerk).toHaveBeenCalledWith('mighty-strikes');
  });
});
