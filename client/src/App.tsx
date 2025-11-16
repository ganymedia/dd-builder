// src/App.tsx

import { useEffect, useState } from 'react';
import './App.css';
import './components/Layout.css';

import type { Build, ClassId, StatMap, ItemSlot } from './types/build';
import { getItemById } from './data/items';
import { getPerkById } from './data/perks';

import { Layout } from './components/Layout';
import { CharacterConfigPanel } from './components/CharacterConfigPanel';
import { GearPanel } from './components/GearPanel';
import { StatsPanel } from './components/StatsPanel';
import { BuildManagerBar } from './components/BuildManagerBar';

import {
  loadBuildsFromStorage,
  saveBuildsToStorage,
  exportBuildToJson,
  importBuildFromJson,
} from './services/buildStorage';

interface BuildState {
  builds: Build[];
  currentBuildId: string;
}

/**
 * Utility: generate a reasonably unique build ID.
 */
function generateBuildId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-expect-error - TS might not know randomUUID on older libs
    return crypto.randomUUID();
  }
  return `build-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

/**
 * Create a brand-new empty build.
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
    id: generateBuildId(),
    name: 'New Build',
    classId: 'fighter',
    baseStats,
    equippedItems: {},
    perks: [],
    activeStatusEffects: [],
    targetEnemyId: undefined,
  };
}

function App() {
  /**
   * BuildState holds a list of builds and which one is currently active.
   * We initialize from localStorage if possible; otherwise we create a new build.
   */
  const [buildState, setBuildState] = useState<BuildState>(() => {
    const loaded = loadBuildsFromStorage();
    if (loaded.length > 0) {
      return {
        builds: loaded,
        currentBuildId: loaded[0].id,
      };
    }
    const initial = createEmptyBuild();
    return {
      builds: [initial],
      currentBuildId: initial.id,
    };
  });

  const { builds, currentBuildId } = buildState;

  // Convenience: derive the current build object.
  const currentBuild: Build | undefined =
    builds.find((b) => b.id === currentBuildId) ?? builds[0];

  /**
   * Persist builds to localStorage whenever the builds array changes.
   */
  useEffect(() => {
    saveBuildsToStorage(builds);
  }, [builds]);

  /**
   * Helper to update the current build immutably.
   * Accepts a function that takes the previous Build and returns a new one.
   */
  const updateCurrentBuild = (updater: (prev: Build) => Build) => {
    setBuildState((prevState) => {
      const idx = prevState.builds.findIndex(
        (b) => b.id === prevState.currentBuildId,
      );
      if (idx === -1) return prevState;

      const oldBuild = prevState.builds[idx];
      const updated = updater(oldBuild);
      const newBuilds = [...prevState.builds];
      newBuilds[idx] = updated;

      return {
        ...prevState,
        builds: newBuilds,
      };
    });
  };

  // ------------- Handlers for character + stats -------------

  const handleClassChange = (classId: ClassId) => {
    updateCurrentBuild((prev) => ({
      ...prev,
      classId,
    }));
  };

  const handleBaseStatChange = (stat: keyof StatMap, value: number) => {
    updateCurrentBuild((prev) => ({
      ...prev,
      baseStats: {
        ...prev.baseStats,
        [stat]: value,
      },
    }));
  };

  // ------------- Handlers for gear + perks -------------

  const handleEquipItem = (slot: ItemSlot, itemId: string | null) => {
    updateCurrentBuild((prev) => {
      const newEquipped = { ...prev.equippedItems };

      if (itemId === null) {
        delete newEquipped[slot];
      } else {
        const item = getItemById(itemId);
        if (!item) {
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

  const handleTogglePerk = (perkId: string) => {
    updateCurrentBuild((prev) => {
      const alreadyHas = prev.perks.some((p) => p.id === perkId);
      if (alreadyHas) {
        return {
          ...prev,
          perks: prev.perks.filter((p) => p.id !== perkId),
        };
      }

      const perk = getPerkById(perkId);
      if (!perk) return prev;

      return {
        ...prev,
        perks: [...prev.perks, perk],
      };
    });
  };

  // ------------- Handler for enemy selection -------------

  const handleTargetEnemyChange = (enemyId: string | null) => {
    updateCurrentBuild((prev) => ({
      ...prev,
      targetEnemyId: enemyId ?? undefined,
    }));
  };

  // ------------- Build manager handlers -------------

  const handleSelectBuild = (buildId: string) => {
    setBuildState((prev) => {
      if (!prev.builds.some((b) => b.id === buildId)) return prev;
      return {
        ...prev,
        currentBuildId: buildId,
      };
    });
  };

  const handleSaveAsNewBuild = () => {
    if (!currentBuild) return;
    const newBuild: Build = {
      ...currentBuild,
      id: generateBuildId(),
      name: `${currentBuild.name} (copy)`,
    };

    setBuildState((prev) => ({
      builds: [...prev.builds, newBuild],
      currentBuildId: newBuild.id,
    }));
  };

  const handleRenameCurrentBuild = (newName: string) => {
    updateCurrentBuild((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  const handleDeleteCurrentBuild = () => {
    setBuildState((prev) => {
      // Don't allow deleting the last build
      if (prev.builds.length <= 1) return prev;

      const newBuilds = prev.builds.filter((b) => b.id !== prev.currentBuildId);
      const newCurrentId = newBuilds[0]?.id ?? prev.currentBuildId;

      return {
        builds: newBuilds,
        currentBuildId: newCurrentId,
      };
    });
  };

  /**
   * Import build from JSON string.
   * Returns { success, error? } so the UI can show messages.
   */
  const handleImportBuild = (
    json: string,
  ): { success: boolean; error?: string } => {
    const imported = importBuildFromJson(json);
    if (!imported) {
      return { success: false, error: 'Invalid JSON or build format.' };
    }

    const newBuild: Build = {
      ...imported,
      // Ensure unique id regardless of what the JSON contains
      id: generateBuildId(),
      // Ensure a non-empty name
      name: imported.name || 'Imported Build',
    };

    setBuildState((prev) => ({
      builds: [...prev.builds, newBuild],
      currentBuildId: newBuild.id,
    }));

    return { success: true };
  };

  /**
   * Export current build as JSON (for copy-paste sharing).
   */
  const handleExportCurrentBuild = (): string => {
    if (!currentBuild) return '';
    return exportBuildToJson(currentBuild);
  };

  if (!currentBuild) {
    return <div>Loading build data...</div>;
  }

  return (
    <Layout>
      {/* LEFT COLUMN: Build Manager + Character Config */}
      <div>
        <BuildManagerBar
          builds={builds}
          currentBuildId={currentBuildId}
          onSelectBuild={handleSelectBuild}
          onSaveAsNew={handleSaveAsNewBuild}
          onRenameCurrent={handleRenameCurrentBuild}
          onDeleteCurrent={handleDeleteCurrentBuild}
          onImportBuild={handleImportBuild}
          onExportCurrent={handleExportCurrentBuild}
        />
        <hr style={{ margin: '0.5rem 0' }} />
        <CharacterConfigPanel
          build={currentBuild}
          onClassChange={handleClassChange}
          onBaseStatChange={handleBaseStatChange}
        />
      </div>

      {/* MIDDLE COLUMN: Gear & Perks */}
      <GearPanel
        build={currentBuild}
        onEquipItem={handleEquipItem}
        onTogglePerk={handleTogglePerk}
      />

      {/* RIGHT COLUMN: Stats */}
      <StatsPanel
        build={currentBuild}
        onTargetEnemyChange={handleTargetEnemyChange}
      />
    </Layout>
  );
}

export default App;

