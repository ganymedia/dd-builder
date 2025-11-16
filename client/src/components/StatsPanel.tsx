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
 * - Shows DPS and TTK vs that enemy for body/head/backstab profiles
 */
export function StatsPanel({ build, onTargetEnemyChange }: StatsPanelProps) {
  // 1. Compute derived stats from the engine
  const derived: DerivedStats = computeDerivedStats(build);
  const { combinedStats, defense, offense } = derived;

  // 2. Resolve enemy
  const enemy = getEnemyById(build.targetEnemyId);

  const handleEnemySelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    onTargetEnemyChange(value === '' ? null : value);
  };

  // 3. Compute simple TTKs for each profile (if we have enemy + DPS > 0)
  let ttkBody: number | null = null;
  let ttkHead: number | null = null;
  let ttkBackstab: number | null = null;

  if (enemy) {
    if (offense.bodyDpsVsEnemy > 0) {
      ttkBody = enemy.maxHealth / offense.bodyDpsVsEnemy;
    }
    if (offense.headshotDpsVsEnemy > 0) {
      ttkHead = enemy.maxHealth / offense.headshotDpsVsEnemy;
    }
    if (offense.backstabDpsVsEnemy > 0) {
      ttkBackstab = enemy.maxHealth / offense.backstabDpsVsEnemy;
    }
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

        {/* Summary (backwards-compatible fields) */}
        <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.9rem' }}>
          <li>
            Weapon Damage / Hit (body, pre-armor):{' '}
            {offense.weaponDamagePerHit.toFixed(1)}
          </li>
          <li>Attacks per Second: {offense.attacksPerSecond.toFixed(2)}</li>
          <li>Approx DPS (body, pre-armor): {offense.approxDps.toFixed(1)}</li>
          {enemy && (
            <li>
              DPS vs {enemy.name} (body):{' '}
              {offense.dpsVsEnemy.toFixed(1)}
            </li>
          )}
        </ul>

        {/* DPS breakdown */}
        <div style={{ marginTop: '0.5rem' }}>
          <h4 style={{ marginBottom: '0.25rem' }}>DPS Breakdown (Pre-Armor)</h4>
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0,
              fontSize: '0.85rem',
            }}
          >
            <li>Body DPS: {offense.bodyDps.toFixed(1)}</li>
            <li>Headshot DPS: {offense.headshotDps.toFixed(1)}</li>
            <li>Backstab DPS: {offense.backstabDps.toFixed(1)}</li>
          </ul>
        </div>

        {/* DPS vs enemy breakdown + TTKs */}
        {enemy && (
          <div style={{ marginTop: '0.5rem' }}>
            <h4 style={{ marginBottom: '0.25rem' }}>
              DPS vs {enemy.name} &amp; TTK
            </h4>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      borderBottom: '1px solid #444',
                      paddingBottom: '0.25rem',
                    }}
                  >
                    Profile
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      borderBottom: '1px solid #444',
                      paddingBottom: '0.25rem',
                    }}
                  >
                    DPS vs Enemy
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      borderBottom: '1px solid #444',
                      paddingBottom: '0.25rem',
                    }}
                  >
                    TTK (s)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Body</td>
                  <td style={{ textAlign: 'right' }}>
                    {offense.bodyDpsVsEnemy.toFixed(1)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {ttkBody !== null ? ttkBody.toFixed(2) : '—'}
                  </td>
                </tr>
                <tr>
                  <td>Headshot</td>
                  <td style={{ textAlign: 'right' }}>
                    {offense.headshotDpsVsEnemy.toFixed(1)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {ttkHead !== null ? ttkHead.toFixed(2) : '—'}
                  </td>
                </tr>
                <tr>
                  <td>Backstab</td>
                  <td style={{ textAlign: 'right' }}>
                    {offense.backstabDpsVsEnemy.toFixed(1)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {ttkBackstab !== null ? ttkBackstab.toFixed(2) : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p
        style={{
          fontSize: '0.8rem',
          opacity: 0.7,
          marginTop: '0.75rem',
        }}
      >
        Formulas are placeholder approximations. All math lives in{' '}
        <code>src/engine/</code>, so you can refine it as you learn more about
        the game without touching the UI.
      </p>
    </div>
  );
}
