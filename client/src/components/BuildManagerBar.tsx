// src/components/BuildManagerBar.tsx

import { useEffect, useState } from 'react';
import type { Build } from '../types/build';

interface BuildManagerBarProps {
  builds: Build[];
  currentBuildId: string;

  onSelectBuild: (id: string) => void;
  onSaveAsNew: () => void;
  onRenameCurrent: (newName: string) => void;
  onDeleteCurrent: () => void;

  onImportBuild: (json: string) => { success: boolean; error?: string };
  onExportCurrent: () => string;
}

/**
 * Simple build manager UI:
 * - Dropdown to select build
 * - Input to rename current
 * - Button to save copy, delete
 * - Import/export via JSON text
 */
export function BuildManagerBar({
  builds,
  currentBuildId,
  onSelectBuild,
  onSaveAsNew,
  onRenameCurrent,
  onDeleteCurrent,
  onImportBuild,
  onExportCurrent,
}: BuildManagerBarProps) {
  const currentBuild = builds.find((b) => b.id === currentBuildId) ?? builds[0];

  const [nameInput, setNameInput] = useState<string>(currentBuild?.name ?? '');
  const [exportJson, setExportJson] = useState<string>('');
  const [importJson, setImportJson] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Keep local name input in sync when current build changes
  useEffect(() => {
    setNameInput(currentBuild?.name ?? '');
    setExportJson('');
    setImportJson('');
    setImportError(null);
  }, [currentBuildId, currentBuild?.name]);

  const handleNameBlur = () => {
    if (!currentBuild) return;
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== currentBuild.name) {
      onRenameCurrent(trimmed);
    } else {
      setNameInput(currentBuild.name); // reset if empty
    }
  };

  const handleExportClick = () => {
    const json = onExportCurrent();
    setExportJson(json);
  };

  const handleImportClick = () => {
    setImportError(null);
    const json = importJson.trim();
    if (!json) {
      setImportError('Paste JSON first.');
      return;
    }
    const result = onImportBuild(json);
    if (!result.success) {
      setImportError(result.error ?? 'Import failed.');
    } else {
      setImportJson('');
      setExportJson('');
    }
  };

  const canDelete = builds.length > 1;

  return (
    <div
      style={{
        padding: '0.4rem 0.4rem 0.5rem 0.4rem',
        background: '#151521',
        borderRadius: '4px',
        border: '1px solid #333',
        marginBottom: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {/* Build selector */}
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.8rem' }}>
            Build:{' '}
            <select
              value={currentBuildId}
              onChange={(e) => onSelectBuild(e.target.value)}
              style={{ maxWidth: '100%' }}
            >
              {builds.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Save copy / delete */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button type="button" onClick={onSaveAsNew}>
            Save Copy
          </button>
          <button
            type="button"
            onClick={onDeleteCurrent}
            disabled={!canDelete}
            title={
              canDelete
                ? 'Delete current build'
                : 'Cannot delete the only build'
            }
          >
            Delete
          </button>
        </div>
      </div>

      {/* Rename field */}
      <div style={{ marginTop: '0.4rem' }}>
        <label style={{ fontSize: '0.8rem' }}>
          Name:{' '}
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameBlur}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      {/* Export / Import JSON */}
      <div
        style={{
          marginTop: '0.4rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-start',
          fontSize: '0.75rem',
        }}
      >
        {/* Export */}
        <div style={{ flex: 1 }}>
          <button
            type="button"
            onClick={handleExportClick}
            style={{ marginBottom: '0.25rem' }}
          >
            Export JSON
          </button>
          {exportJson && (
            <textarea
              readOnly
              value={exportJson}
              rows={4}
              style={{
                width: '100%',
                resize: 'vertical',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
              }}
            />
          )}
        </div>

        {/* Import */}
        <div style={{ flex: 1 }}>
          <button
            type="button"
            onClick={handleImportClick}
            style={{ marginBottom: '0.25rem' }}
          >
            Import JSON
          </button>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste build JSON here"
            rows={4}
            style={{
              width: '100%',
              resize: 'vertical',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
            }}
          />
          {importError && (
            <div style={{ color: '#ff6b6b', marginTop: '0.15rem' }}>
              {importError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
