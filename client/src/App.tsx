// src/App.tsx

import { useState } from 'react';
import './App.css';
import './components/Layout.css';

// Import our types
import type { Build, ClassId, StatMap, ItemSlot } from './types/build';

// Data Helpers
import { getItemById } from './data/items';

// Import our layout components
import { Layout } from './components/Layout';
import { CharacterConfigPanel } from './components/CharacterConfigPanel';
import { GearPanel } from './components/GearPanel';
import { StatsPanel } from './components/StatsPanel';
import { getPerkById } from './data/perks';

export default App;

/**
 * This helper creates a very simple "empty" build.
 * In a real app, you'd probably have one per class with default stats.
 */
function createEmptyBuild(): Build {
  const baseStats: StatMap = {
    strength: 10,
    agility: 10,
    will: 10,
    knowledge: 10,
    health: 100,
    resource: 0,
  };

  return {
    id: 'local-1',
    name: 'New Build',
    classId: 'fighter',
    baseStats,
    equippedItems: {},
    perks: [],
    activeStatusEffects: [],
  };
}

function App() {
  /**
   * React's useState hook:
   * - Returns a pair: [currentValue, setterFunction]
   * - When you call setterFunction(newValue), React re-renders the component.
   *
   * Here, our state is the current "Build" we are editing.
   * `Build` is the TypeScript interface we defined earlier.
   */
  const [build, setBuild] = useState<Build>(createEmptyBuild());

  /**
   * Handler for when the user changes the class (e.g. Fighter -> Ranger).
   * This function will be passed down to the CharacterConfigPanel.
   */
  const handleClassChange = (classId: ClassId) => {
    setBuild((prev) => ({
      ...prev,
      classId,
    }));
  };

  /**
   * Handler for when the user updates one of the base stats.
   * `keyof StatMap` ensures we only accept a valid stat name.
   */
  const handleBaseStatChange = (stat: keyof StatMap, value: number) => {
    setBuild((prev) => ({
      ...prev,
      baseStats: {
        ...prev.baseStats,
        [stat]: value,
      },
    }));
  };

  /**
   * Toggle a perk on/off:
   * - If it's in build.perks, remove it.
   * - Otherwise, look it up in data and add it.
   */
  const handleTogglePerk = (perkId: string) => {
    setBuild((prev) => {
      const currentlySelected = prev.perks.some((p) => p.id === perkId);

      if (currentlySelected) {
        // Remove the perk
        return {
          ...prev,
          perks: prev.perks.filter((p) => p.id !== perkId),
        };
      }

      const perk = getPerkById(perkId);
      if (!perk) {
        return prev; // unknown perk; no-op
      }

      return {
        ...prev,
        perks: [...prev.perks, perk],
      };
    });
  };

  /**
   * Handler for when the user selects a target enemy in the StatsPanel.
   * We store only the enemy ID in the build; the engine resolves it to a full profile.
   */
  const handleTargetEnemyChange = (enemyId: string | null) => {
    setBuild((prev) => ({
      ...prev,
      targetEnemyId: enemyId ?? undefined,
    }));
  };
  
  /**
   * Handler for equipping/unequipping items.
   * - If itemId is null: remove any item currently in that slot.
   * - If itemId is a string: look up the item in our data and equip it.
   *
   * Note: we store the full Item object in equippedItems for now.
   * Later, you might choose to store just IDs and resolve them in the engine.
   */
  const handleEquipItem = (slot: ItemSlot, itemId: string | null) => {
    setBuild((prev) => {
      const newEquipped = { ...prev.equippedItems };

      if (itemId === null) {
        // Unequip the item from this slot
        delete newEquipped[slot];
      } else {
        const item = getItemById(itemId);
        if (!item) {
          // If item not found, we simply skip; in a real app, you'd log or warn.
          return prev;
        }
        newEquipped[slot] = item;
      }

      return {
        ...prev,
        equippedItems: newEquipped,
      };
    });
  };
  // For now, GearPanel and StatsPanel will be mostly placeholders with stubs.
  // We still pass the build to show how data will flow.
  return (
    <Layout>
      <CharacterConfigPanel
        build={build}
        onClassChange={handleClassChange}
        onBaseStatChange={handleBaseStatChange}
      />
      <GearPanel
        build={build}
        onEquipItem={handleEquipItem}
        onTogglePerk={handleTogglePerk}
      />
      <StatsPanel
        build={build}
        onTargetEnemyChange={handleTargetEnemyChange}
      />
    </Layout>
  );
};
