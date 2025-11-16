// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,

    // Default environment for tests
    // We make jsdom the default since you’re using React Testing Library.
    environment: 'jsdom',

    // Override to node for engine tests (pure TS, no DOM)
    environmentMatchGlobs: [
      ['src/engine/**', 'node'],
    ],

    // Match both .ts and .tsx test files
    include: ['src/**/*.test.{ts,tsx}'],

    // Global setup for jest-dom, etc.
    setupFiles: './src/test/setup.ts',
  },
});
