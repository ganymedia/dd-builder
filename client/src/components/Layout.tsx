// src/components/Layout.tsx

import type { ReactNode } from 'react';
import './Layout.css';

/**
 * Layout is a simple wrapper that defines the high-level structure:
 * three columns (character, gear/perks, stats) like Path of Building.
 *
 * ReactNode is the type for "anything you can render" (elements, strings, arrays).
 */
export function Layout({ children }: { children: ReactNode }) {
  // We expect exactly 3 children: [CharacterConfig, GearPanel, StatsPanel]
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Dark &amp; Darker Build Planner (WIP)</h1>
      </header>

      <main className="app-main">
        <section className="app-column app-column-left">{childArray[0]}</section>
        <section className="app-column app-column-center">{childArray[1]}</section>
        <section className="app-column app-column-right">{childArray[2]}</section>
      </main>
    </div>
  );
}

