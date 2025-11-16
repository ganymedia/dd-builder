// src/services/buildStorage.ts

import type { Build } from '../types/build';

const STORAGE_KEY = 'dark-darker-planner-builds-v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Load builds array from localStorage.
 * Returns [] if nothing stored or parse fails.
 */
export function loadBuildsFromStorage(): Build[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Build[];
  } catch {
    return [];
  }
}

/**
 * Save builds array to localStorage.
 */
export function saveBuildsToStorage(builds: Build[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  } catch {
    // ignore storage failures
  }
}

/**
 * Export a single build as pretty JSON.
 */
export function exportBuildToJson(build: Build): string {
  return JSON.stringify(build, null, 2);
}

/**
 * Import a build from JSON text.
 * Returns null if invalid or missing required fields.
 */
export function importBuildFromJson(json: string): Build | null {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return null;

    // Minimal sanity check.
    if (!('id' in parsed) || !('name' in parsed) || !('classId' in parsed)) {
      return null;
    }

    return parsed as Build;
  } catch {
    return null;
  }
}
