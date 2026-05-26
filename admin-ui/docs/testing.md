# Testing

Jest + Testing Library + jsdom. Unit and component tests live next to the code they cover.

## Layout

```text
<rootDir>/
├── jest.config.ts               # Jest config (TS) — see below
├── jest/
│   ├── setup-tests.ts           # runs before module imports (Jest `setupFiles`)
│   └── setup.ts                 # runs after the test env is set up (`setupFilesAfterEnv`)
├── __mocks__/                   # shared mocks (cedarling, hmr, file/style stubs, …)
└── app/ + plugins/              # tests live in __tests__/ siblings of the code
```

## Running

| Command            | What it does                                                  |
| ------------------ | ------------------------------------------------------------- |
| `npm test`         | Jest with `--forceExit` (good for watch-friendly local work)  |
| `npm run test:all` | Jest `--runInBand --watchman=false` (used in CI / single-pass |

## Test discovery

`jest.config.ts` matches `__tests__/**/*.test.[jt]s?(x)` and `*.(spec|test).[jt]s?(x)`. Place your test alongside the file it covers in a `__tests__/` sibling — that's the convention everywhere in the repo.

```text
plugins/scim/
├── components/
│   └── ScimPage.tsx
└── __tests__/
    └── components/
        └── ScimPage.test.tsx
```

## Environment

- `testEnvironment: 'jsdom'` — DOM available in tests; `window`, `document` etc. work.
- `testEnvironmentOptions.url` is `https://admin-ui-test.gluu.org/` — drives `window.location` in tests.
- `jest/setup-tests.ts` loads `.env.production` via `dotenv` before any module imports.
- `jest/setup.ts` initializes i18next and silences expected console noise (`console.log`/`warn` are spied; specific `console.error` messages are filtered).

## Path aliases in tests

`moduleNameMapper` in `jest.config.ts` mirrors `tsconfig.json` so `@/...`, `Plugins/...`, `JansConfigApi`, `Orval`, etc. all resolve the same way they do in source. Don't reach into relative paths to dodge alias rules — fix the mapper if a new alias is missing.

## Shared mocks (`__mocks__/`)

| Mock                                           | Why it's there                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `@janssenproject/cedarling_wasm.ts`            | replaces the WASM bundle (jsdom can't load it)                                  |
| `cedarlingHookBridge.ts`                       | stub for `@/cedarling/hooks/useCedarling` so components don't hit the real auth |
| `fileMock.ts` / `styleMock.ts`                 | inert stubs for image, font, and `.css/.scss` imports                           |
| `hmr.ts`, `utilities.ts`, `loadPluginMetadata` | inert stubs for runtime-only modules that crash jsdom                           |

Don't duplicate these in individual tests — import from / let `moduleNameMapper` route to them.

## Writing a component test

The repo's standard wrapper supplies a Redux store, React Query client, i18n, and routing. Reach for it instead of hand-wiring providers:

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

Don't grant blanket `true` for both read and write in every test — flip them to verify the gated UI actually disappears.

## Writing a saga / reducer test

Reducers are pure — test directly:

```ts
import reducer, { yourAction } from '@/redux/features/yourSlice'

it('reduces yourAction', () => {
  const next = reducer(initialState, yourAction(payload))
  expect(next.field).toBe(expected)
})
```

For sagas, the project uses `redux-saga-test-plan` (`expectSaga`) — see existing examples under `app/redux/sagas/__tests__/`.

## Common conventions

- **No real network calls.** Mock the Orval hook or the API function at the import boundary. axios is set up once globally; mocking it directly is brittle.
- **No real timers** without `jest.useFakeTimers()` — idle-timer and session-timeout code uses real `setInterval`.
- **Snapshot tests are discouraged** for anything beyond inert presentational output — they rot fast.
- **Translation keys, not English strings.** Use the `t()` key in assertions when the rendered text is i18n-driven; the test i18n init returns keys verbatim by default.
- **Mock Cedarling.** Every page guarded by `useCedarling()` needs the hook mocked or the test renders nothing.

## Knip + tests

Tests count as "used" for the production graph only if they actually import the production module. A spec that mocks a module without importing it won't keep the production file alive in knip's view. If you're sure the production code is used, check that the test isn't using `jest.mock(...)` _instead of_ importing.
