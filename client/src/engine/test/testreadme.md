How the modular environment works (no manual toggling)

With this setup:

Default: environment: 'node'

All tests run in Node unless they match environmentMatchGlobs.

Component tests (src/components/**):

Automatically run under jsdom, via:

environmentMatchGlobs: [
  ['src/components/**', 'jsdom'],
]


So you can add more tests:

src/engine/foo.test.ts → Node

src/components/bar.test.tsx → jsdom

…without touching the config again.

If you ever want to temporarily force one env for everything, you can run:

# all tests in jsdom temporarily
npx vitest --environment=jsdom

# or
npx vitest --environment=node

But your normal workflow can just be:
npm run test
npm run test:watch

