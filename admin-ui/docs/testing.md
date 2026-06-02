# Testing

Jest + React Testing Library + jsdom. Tests live next to the code they cover.

## Layout

```text
<rootDir>/
├── jest.config.ts
├── jest/
│   ├── setup-tests.ts   # setupFiles - before module imports
│   └── setup.ts         # setupFilesAfterEnv - after test framework
├── __mocks__/           # shared manual mocks
└── app/ + plugins/      # tests in __tests__/ siblings
```

Mirror the source structure inside `__tests__/`:

```text
plugins/scim/
├── components/ScimPage.tsx
└── __tests__/components/ScimPage.test.tsx
```

## Running

| Command            | What it does                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| `npm test`         | Plain `jest`: parallel workers + Watchman, for watch-friendly local work |
| `npm run test:all` | `jest --runInBand --watchman=false`: single process, deterministic       |

After a full run, Jest may log _"Force exiting Jest…"_. Production code under test (idle timers, license polling) leaves open handles. Tests passed. The warning is about cleanup. Add `--detectOpenHandles` for one-off investigation. Don't leave it on (it's slow).

## Test discovery

`jest.config.ts` matches `__tests__/**/*.test.[jt]s?(x)` and `*.(spec|test).[jt]s?(x)`. New tests go in `__tests__/`.

## Test environment

Each file runs in fresh jsdom. Setup runs before any test code:

1. **`jest/setup-tests.ts`**: loads `.env.development` via `dotenv` (tests are dev workflow; only `build:prod` and `preview:prod` touch `.env.production`). Polyfills `TextEncoder` / `TextDecoder` from `node:util`: jsdom lacks them and react-router needs them at module load.
2. **`jest/setup.ts`**: initializes i18next so `t()` works in components. Spies `console.log` / `console.warn`. Filters specific known `console.error` patterns.

`testEnvironmentOptions.url = 'https://admin-ui-test.gluu.org/'`: drives `window.location` in tests.

## Path aliases in tests

`moduleNameMapper` in `jest.config.ts` mirrors `tsconfig.json`. `@/...`, `Plugins/...`, `JansConfigApi`, etc. all resolve. Don't reach for relative paths to dodge an alias. Add the alias to `moduleNameMapper` if it's missing. Drift between `tsconfig.json` and `jest.config.ts` causes obscure "module not found" errors.

## Shared mocks

`__mocks__/` holds Jest manual mocks wired via `moduleNameMapper`: they apply automatically.

| Mock                                           | Why it's there                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `@janssenproject/cedarling_wasm.ts`            | Replaces the WASM bundle (jsdom can't load it)                                  |
| `cedarlingHookBridge.ts`                       | Stub for `@/cedarling/hooks/useCedarling` so components don't hit the real auth |
| `fileMock.ts` / `styleMock.ts`                 | Inert stubs for image, font, `.css/.scss` imports                               |
| `hmr.ts`, `utilities.ts`, `loadPluginMetadata` | Inert stubs for runtime-only modules that crash jsdom                           |

Don't re-mock these in individual test files. Creates competing definitions.

## Writing a component test

Use the repo's standard wrapper. It provides Redux store, React Query client, i18n, routing.

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
  const { getByText } = render(<AppTestWrapper><YourPage /></AppTestWrapper>)
  expect(getByText(/expected text/i)).toBeInTheDocument()
})
```

- Don't grant blanket `true` for both read and write in every test. Flip them off in at least one to verify the gated UI actually disappears.
- Mock `useCedarling`, not the underlying tokens. Unmocked, Cedarling sees no tokens, returns `undefined`, and the page hides everything.

## Writing a saga / reducer test

Reducers are pure. Test directly:

```ts
import reducer, { yourAction } from '@/redux/features/yourSlice'

it('reduces yourAction', () => {
  expect(reducer(initialState, yourAction(payload)).field).toBe(expected)
})
```

For sagas, use `redux-saga-test-plan`'s `expectSaga`. Examples under `app/redux/sagas/__tests__/`.

## Conventions

- **No real network calls**: mock the Orval hook or API helper at the import boundary. Mocking the shared axios directly is brittle.
- **No real timers without `jest.useFakeTimers()`**: idle-timer and session-timeout use real `setInterval` / `setTimeout`.
- **Snapshots are discouraged** beyond inert presentational output. They rot.
- **Translation keys, not English strings**: test-mode i18n returns keys verbatim, so `getByText('users.addUser')` works.
- **Mock Cedarling on any guarded page**: otherwise every permission check returns `undefined` and the page renders nothing.

## Knip and tests

knip uses production imports to decide if a module is used. Test files don't count. A `jest.mock(...)` that _replaces_ a module doesn't keep the production file alive in knip's view. If knip flags a module you know is in use, check whether the test mocks it _instead of_ importing it.
