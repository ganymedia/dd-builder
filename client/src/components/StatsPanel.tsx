// src/components/StatsPanel.tsx

import type { Build } from '../types/build';
import type { DerivedStats } from '../types/derived';
import { computeDerivedStats } from '../engine';
import { ENEMIES, getEnemyById } from '../data/enemies';

interface StatsPanelProps {
  build: Build;

  /**
   * Callback for when the user selects a target enemy.
   * - If enemyId is null, we consider "no specific enemy selected".
   */
  onTargetEnemyChange: (enemyId: string | null) => void;
}

/**
 * This panel now:
 * - Lets the user choose an enemy profile
 * - Calls the engine to compute DerivedStats
 * - Shows DPS and TTK vs that enemy
 */
export function StatsPanel({ build, onTargetEnemyChange }: StatsPanelProps) {
  // Call our pure calculation engine.
  const derived: DerivedStats = computeDerivedStats(build);
  const { combinedStats, defense, offense } = derived;

  const enemy = getEnemyById(build.targetEnemyId);

  const handleEnemySelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    onTargetEnemyChange(value === '' ? null : value);
  };

  // Compute a very simple "time to kill" if we have an enemy and DPS > 0
  let timeToKillSeconds: number | null = null;
  if (enemy && offense.dpsVsEnemy > 0) {
    timeToKillSeconds = enemy.maxHealth / offense.dpsVsEnemy;
  }

  return (
    <div>
      <h2>Stats</h2>

      {/* Build summary */}
      <section style={{ marginBottom: '0.75rem' }}>
        <div>
          <strong>Build Name:</strong> {build.name}
        </div>
        <div>
          <strong>Class:</strong> {build.classId}
        </div>
      </section>

      {/* Enemy selection */}
      <section style={{ marginBottom: '0.75rem' }}>
        <h3>Target Enemy</h3>
        <label style={{ fontSize: '0.9rem' }}>
          Enemy:{' '}
          <select
            value={build.targetEnemyId ?? ''}
            onChange={handleEnemySelectChange}
          >
            <option value="">(none)</option>
            {ENEMIES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>

        {enemy && (
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0,
              marginTop: '0.4rem',
              fontSize: '0.85rem',
            }}
          >
            <li>HP: {enemy.maxHealth}</li>
            <li>Armor Rating: {enemy.armorRating ?? 0}</li>
          </ul>
        )}
      </section>

      {/* Combined stats */}
      <section style={{ marginBottom: '0.75rem' }}>
        <h3>Core Stats (Combined)</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.9rem' }}>
          <li>Strength: {combinedStats.strength ?? 0}</li>
          <li>Agility: {combinedStats.agility ?? 0}</li>
          <li>Will: {combinedStats.will ?? 0}</li>
          <li>Knowledge: {combinedStats.knowledge ?? 0}</li>
          <li>Health: {combinedStats.health ?? 0}</li>
          <li>Resource: {combinedStats.resource ?? 0}</li>
        </ul>
      </section>

      {/* Defense */}
      <section style={{ marginBottom: '0.75rem' }}>
        <h3>Defense</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.9rem' }}>
          <li>HP: {defense.hitPoints.toFixed(1)}</li>
          <li>Armor Rating: {defense.armorRating.toFixed(1)}</li>
          <li>EHP (approx): {defense.effectiveHitPoints.toFixed(1)}</li>
        </ul>
      </section>

      {/* Offense */}
      <section>
        <h3>Offense</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.9rem' }}>
          <li>
            Weapon Damage / Hit (pre-armor):{' '}
            {offense.weaponDamagePerHit.toFixed(1)}
          </li>
          <li>Attacks per Second: {offense.attacksPerSecond.toFixed(2)}</li>
          <li>Approx DPS (pre-armor): {offense.approxDps.toFixed(1)}</li>
          {enemy && (
            <>
              <li>
                DPS vs {enemy.name}:{' '}
                {offense.dpsVsEnemy.toFixed(1)}
              </li>
              {timeToKillSeconds !== null && (
                <li>
                  TTK vs {enemy.name}:{' '}
                  {timeToKillSeconds.toFixed(2)}s
                </li>
              )}
            </>
          )}
        </ul>
      </section>

      <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.75rem' }}>
        Formulas are placeholder approximations. The important part is that all math
        lives in <code>src/engine/</code>, so you can refine it as you learn more
        about the game without touching the UI.
      </p>
    </div>
  );
}