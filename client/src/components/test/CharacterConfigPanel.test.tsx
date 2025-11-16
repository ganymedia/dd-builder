// src/components/__tests__/CharacterConfigPanel.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Build } from '../../types/build';
import { CharacterConfigPanel } from '../CharacterConfigPanel';

function createTestBuild(): Build {
  return {
    id: 'test-build',
    name: 'Test Build',
    classId: 'fighter',
    baseStats: {
      strength: 10,
      agility: 12,
      will: 8,
      knowledge: 8,
      health: 100,
      resource: 0,
    },
    equippedItems: {},
    perks: [],
    activeStatusEffects: [],
  };
}

describe('CharacterConfigPanel', () => {
  it('renders with initial class and stats', () => {
    const build = createTestBuild();

    render(
      <CharacterConfigPanel
        build={build}
        onClassChange={vi.fn()}
        onBaseStatChange={vi.fn()}
      />,
    );

    // Class select should have Fighter selected
    const classSelect = screen.getByLabelText(/class/i) as HTMLSelectElement;
    expect(classSelect.value).toBe('fighter');

    // Strength input should show 10
    const strengthInput = screen.getByLabelText(/strength/i) as HTMLInputElement;
    expect(strengthInput.value).toBe('10');
  });

  it('calls onClassChange when class is changed', () => {
    const build = createTestBuild();
    const onClassChange = vi.fn();

    render(
      <CharacterConfigPanel
        build={build}
        onClassChange={onClassChange}
        onBaseStatChange={vi.fn()}
      />,
    );

    const classSelect = screen.getByLabelText(/class/i) as HTMLSelectElement;

    fireEvent.change(classSelect, { target: { value: 'ranger' } });

    expect(onClassChange).toHaveBeenCalledTimes(1);
    expect(onClassChange).toHaveBeenCalledWith('ranger');
  });

  it('calls onBaseStatChange when a base stat is edited', () => {
    const build = createTestBuild();
    const onBaseStatChange = vi.fn();

    render(
      <CharacterConfigPanel
        build={build}
        onClassChange={vi.fn()}
        onBaseStatChange={onBaseStatChange}
      />,
    );

    const strengthInput = screen.getByLabelText(/strength/i) as HTMLInputElement;

    fireEvent.change(strengthInput, { target: { value: '15' } });

    expect(onBaseStatChange).toHaveBeenCalledTimes(1);
    // Expect arguments: ('strength', 15)
    expect(onBaseStatChange).toHaveBeenCalledWith('strength', 15);
  });
});
