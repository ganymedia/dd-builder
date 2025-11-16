// src/components/CharacterConfigPanel.tsx

import type { Build, ClassId, StatMap } from '../types/build';

/**
 * Props (inputs) for CharacterConfigPanel.
 * In React + TypeScript, we usually define a dedicated type for props.
 */
interface CharacterConfigPanelProps {
  build: Build;
  onClassChange: (classId: ClassId) => void;
  onBaseStatChange: (stat: keyof StatMap, value: number) => void;
}

/**
 * This component is responsible for:
 * - Letting the user select class
 * - Editing base stats
 *
 * It does NOT perform any calculations; it just emits changes via callbacks.
 * This keeps the component "dumb" and reusable, and centralizes logic in App.
 */
export function CharacterConfigPanel(props: CharacterConfigPanelProps) {
  const { build, onClassChange, onBaseStatChange } = props;

  const handleClassSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    // event.target.value is a string; we assert it as ClassId here
    onClassChange(event.target.value as ClassId);
  };

  const handleStatInputChange = (
    stat: keyof StatMap,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const numericValue = Number(event.target.value) || 0;
    onBaseStatChange(stat, numericValue);
  };

  return (
    <div>
      <h2>Character</h2>

      {/* Class selection */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Class:{' '}
          <select value={build.classId} onChange={handleClassSelectChange}>
            <option value="fighter">Fighter</option>
            <option value="barbarian">Barbarian</option>
            <option value="ranger">Ranger</option>
            <option value="wizard">Wizard</option>
            <option value="cleric">Cleric</option>
            <option value="rogue">Rogue</option>
          </select>
        </label>
      </div>

      {/* Base stats */}
      <div>
        <h3>Base Stats</h3>
        {(
          [
            'strength',
            'agility',
            'will',
            'knowledge',
            'health',
            'resource',
          ] as (keyof StatMap)[]
        ).map((statKey) => (
          <div key={statKey} style={{ marginBottom: '0.25rem' }}>
            <label>
              {statKey.charAt(0).toUpperCase() + statKey.slice(1)}:{' '}
              <input
                type="number"
                value={build.baseStats[statKey] ?? 0}
                onChange={(event) => handleStatInputChange(statKey, event)}
                style={{ width: '4rem' }}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
