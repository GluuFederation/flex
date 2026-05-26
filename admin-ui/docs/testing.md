# Testing

## Introduction

Tests in the Admin UI exist to catch the things types alone cannot: that a button renders only when the user has the right permission, that a saga finishes a flow in the expected order, that a reducer transforms state correctly. The stack is intentionally boring — Jest + React Testing Library + jsdom — because there is no need for anything more exotic, and the unit-test surface stays predictable.

A few terms appear throughout this document:

- **Jest** — the test runner. It discovers, runs, and reports on test files. Configuration lives in [`admin-ui/jest.config.ts`](../jest.config.ts).
- **React Testing Library** — a small library on top of Jest that mounts React components, queries the rendered output the way a user would (by visible text, by ARIA role), and asserts on what they see.
- **jsdom** — a browser-like environment implemented in JavaScript. Jest runs each test file inside a fresh jsdom instance so component code can call `document.querySelector`, `window.location`, `localStorage`, etc., without a real browser.
- **`setupFiles`** vs **`setupFilesAfterEnv`** — both run before tests, but at different points. `setupFiles` runs before any module imports (good for polyfills, dotenv); `setupFilesAfterEnv` runs after the test framework is installed (good for i18n init, console silencing).
- **`moduleNameMapper`** — the part of Jest config that rewrites import paths. This is how `@/utils/x` resolves to `app/utils/x` in tests the same way it does in source.

The remainder of this document covers where tests live, how to run them, what setup happens before they execute, and how to write the two most common kinds (component tests and saga / reducer tests).

## Where tests live

Two conventions matter:

```text
<rootDir>/
├── jest.config.ts               # Jest config (TS) — see below
├── jest/
│   ├── setup-tests.ts           # runs before module imports (Jest `setupFiles`)
│   └── setup.ts                 # runs after the test env is set up (`setupFilesAfterEnv`)
├── __mocks__/                   # shared mocks (cedarling, hmr, file/style stubs, …)
└── app/ + plugins/              # tests live in __tests__/ siblings of the code
```

Test files live **alongside** the code they cover, under a `__tests__/` folder. The repo-wide convention is mirror-the-folder-structure inside `__tests__/`:

```text
plugins/scim/
├── components/
│   └── ScimPage.tsx
└── __tests__/
    └── components/
        └── ScimPage.test.tsx
```

This pattern keeps tests discoverable (open the plugin, scan its `__tests__/`), keeps them close to the code (so a rename of the source file is an obvious signal to rename the test), and matches the Jest default discovery pattern below.

## Running tests

Two scripts are available, each tuned for a different use case:

| Command            | What it does                                                               |
| ------------------ | -------------------------------------------------------------------------- |
| `npm test`         | Jest with `--forceExit` — good for watch-friendly local work               |
| `npm run test:all` | Jest `--forceExit --runInBand --watchman=false` — used in CI / single-pass |

The differences:

- **`npm test`** runs Jest with its default parallel worker pool and Watchman-backed file scanning. Fast on developer machines.
- **`npm run test:all`** runs everything in a single process (`--runInBand`) with Watchman disabled. Slower but more deterministic — no parallel-worker race conditions, no environment assumptions about Watchman being installed. Use it when you suspect flakiness or are attaching a debugger.

Both pass `--forceExit` because some setup in the production code (idle timers, license polling) leaves open handles after tests finish. Without `--forceExit` Jest would hang waiting for those — the warning _"A worker process has failed to exit gracefully"_ is the symptom, not a real failure.

## Test discovery

`jest.config.ts` matches two patterns:

- `__tests__/**/*.test.[jt]s?(x)` — files under any `__tests__/` folder, ending in `.test.ts`, `.test.tsx`, `.test.js`, or `.test.jsx`.
- `*.(spec|test).[jt]s?(x)` — files anywhere ending in `.spec.*` or `.test.*`.

Always place new tests in a `__tests__/` sibling of the source file. The second pattern exists to accept legacy `.spec.ts` files but new tests should follow the `__tests__/` convention.

## Test environment

Each test file runs in a fresh jsdom instance. Two pieces of setup happen before any test code:

1. **`jest/setup-tests.ts`** (`setupFiles`) loads `.env.production` via `dotenv` before any module imports. This puts the env values into `process.env` so production code that reads them during module load gets the expected values.
2. **`jest/setup.ts`** (`setupFilesAfterEnv`) runs after the test framework is installed. It initializes i18next so the `t()` hook works inside components, and silences expected console noise — `console.log` and `console.warn` are spied (so you can assert on them), and specific known `console.error` patterns are filtered.

`testEnvironmentOptions.url` is `https://admin-ui-test.gluu.org/`. That URL drives `window.location` in tests, which matters for code that reads the current pathname, host, or query string. If your code branches on `window.location`, expect that URL to be the value.

## Path aliases in tests

The `moduleNameMapper` in `jest.config.ts` mirrors `tsconfig.json`. Aliases that work in source — `@/...`, `Plugins/...`, `JansConfigApi`, `Orval`, etc. — work the same way in tests. Some examples:

- `@/utils/devLogger` resolves to `app/utils/devLogger.ts`
- `Plugins/auth-server/components/Foo` resolves to `plugins/auth-server/components/Foo.tsx`
- `JansConfigApi` resolves to `jans_config_api_orval/src/index.ts`

Don't reach into relative paths in tests to dodge an alias — if a new alias is missing in `moduleNameMapper`, add it. Drift between `tsconfig.json` and `jest.config.ts` here causes obscure "module not found" errors that are easy to misdiagnose.

## Shared mocks

`__mocks__/` at the repo root holds **Jest manual mocks** — stubs that automatically replace specific imports in every test. They exist because some modules can't run in jsdom or would make tests slow / flaky.

| Mock                                           | Why it's there                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `@janssenproject/cedarling_wasm.ts`            | Replaces the WASM bundle (jsdom can't load it)                                  |
| `cedarlingHookBridge.ts`                       | Stub for `@/cedarling/hooks/useCedarling` so components don't hit the real auth |
| `fileMock.ts` / `styleMock.ts`                 | Inert stubs for image, font, and `.css/.scss` imports                           |
| `hmr.ts`, `utilities.ts`, `loadPluginMetadata` | Inert stubs for runtime-only modules that crash jsdom                           |

These are wired up by `moduleNameMapper`, so they apply automatically — you don't need to do `jest.mock(...)` for them in individual tests. Don't duplicate them inside a test file either; that creates two competing definitions.

## Writing a component test

The repo's standard wrapper supplies a Redux store, a React Query client, i18n, and routing. Use it instead of hand-wiring providers — it's the only way to make sure your component sees the same environment as production.

```ts
import { render } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import YourPage from 'Plugins/<name>/components/YourPage'

jest.mock('@/cedarling', () => ({
  useCedarling: () => ({
    hasCedarReadPermission: () => true,
    hasCedarWritePermission: () => true,
    authorizeHelper: jest.fn(),
  }),
  ADMIN_UI_RESOURCES: { /* the keys your page reads */ },
}))

it('renders', () => {
  const { getByText } = render(
    <AppTestWrapper>
      <YourPage />
    </AppTestWrapper>,
  )
  expect(getByText(/expected text/i)).toBeInTheDocument()
})
```

Two practical notes:

- **Don't grant blanket `true` for both read and write in every test.** Flip them off in at least one test so you verify the gated UI actually disappears when permissions are absent. A test that always sees the UI is not testing the permission gate.
- **Mock Cedarling, not the underlying tokens.** Every page guarded by `useCedarling()` needs the hook mocked or the test renders nothing — Cedarling sees no tokens, returns `undefined` for every permission, and the page hides everything.

## Writing a saga / reducer test

Reducers are pure functions, so test them directly:

```ts
import reducer, { yourAction } from '@/redux/features/yourSlice'

it('reduces yourAction', () => {
  const next = reducer(initialState, yourAction(payload))
  expect(next.field).toBe(expected)
})
```

For sagas, the project uses **`redux-saga-test-plan`** and its `expectSaga` helper. It steps a saga through its yielded effects and lets you assert on each one — what got `call`ed, what got `put`, what selector ran. Existing examples under `app/redux/sagas/__tests__/` are the easiest reference; pattern-match from there.

## Common conventions

A short list of rules that keep tests stable and meaningful:

- **No real network calls.** Mock the Orval hook or the API helper at the import boundary. The shared axios instance is set up once globally; mocking it directly is brittle and tends to leak between tests.
- **No real timers without `jest.useFakeTimers()`.** The idle-timer and session-timeout code uses real `setInterval` / `setTimeout`. Real timers in tests cause non-deterministic failures.
- **Snapshot tests are discouraged** for anything beyond inert presentational output. They rot fast — a change anywhere in the rendered tree breaks them and you end up updating snapshots without thinking about what changed.
- **Translation keys, not English strings.** When the rendered text is i18n-driven, assert on the key. The test-mode i18n init returns keys verbatim by default, so `getByText('users.addUser')` works.
- **Mock Cedarling on any page that uses it.** Without a mock, every permission check returns `undefined` and the page renders almost nothing.

## Knip and tests

knip looks at production imports to decide whether a module is used. A test file does not count as a production import — even if a spec exhaustively exercises a module, knip will flag the module as unused if nothing under `app/` or `plugins/` imports it for real.

This means a `jest.mock(...)` block that _replaces_ a module does **not** keep the production file alive in knip's view. If knip flags a production module you know is in use, check whether the test file uses `jest.mock(...)` _instead of_ importing the module — that's the most common cause.

## Where to read next

- [recipes.md](./recipes.md) — concrete recipes for adding a new page, slice, saga (each comes with how to test it)
- [conventions.md](./conventions.md) — broader code conventions tests should follow
- [architecture.md](./architecture.md) — how the host and plugins fit together (helps when deciding what to mock)
- [cedarling.md](./cedarling.md) — what `useCedarling` actually does, so you know what to mock and why
