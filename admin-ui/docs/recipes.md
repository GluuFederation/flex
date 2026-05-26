# Recipes

## Introduction

This document is a collection of short, opinionated walkthroughs for tasks that come up regularly in the Admin UI codebase — adding a page to an existing plugin, regenerating the Config API client, writing a new Redux slice, gating UI on a Cedarling permission, recording an audit entry, and so on. Each recipe names the files you'll edit, the conventions you have to follow, and a working code skeleton you can adapt.

These are not exhaustive references. They are starting points. If a recipe shows a snippet that doesn't match the file you're looking at, look at a nearby plugin that does something similar — most of the patterns in this codebase are repeated across plugins, and the easiest way to add a sixth instance is to read the existing five.

Cross-references to the longer documentation are sprinkled throughout. If you're hitting a recipe for the first time, follow the link the first time and skip it on subsequent passes.

## Add a new page inside an existing plugin

Most new features in the Admin UI go inside an existing plugin (e.g. adding a "Bulk Import" page to `user-management`). The pattern is the same regardless of plugin: a component, a route constant, a sidebar entry, translations, and a test.

### Step 1 — Create the component files

Each page lives in the plugin's `components/` folder, with its types and any custom data hook colocated:

```text
plugins/<plugin>/components/YourPage.tsx
plugins/<plugin>/components/types.ts                    # extend with YourPage types
plugins/<plugin>/components/hooks/useYourPageApi.ts     # data hook (if needed)
```

The data hook usually wraps one or more Orval-generated hooks from the Config API — see [Call the Config API](#call-the-config-api) for the pattern.

### Step 2 — Add a route constant

Never hard-code route paths in components. Routes live as constants in `app/helpers/navigation.ts`:

```ts
YOUR_PAGE: `${PLUGIN_BASE_PATHS.<PLUGIN>}/your-page`,
```

This keeps every URL in one place. If you ever rename a path, you find it through the constant.

### Step 3 — Register the route and sidebar entry

Each plugin's `plugin-metadata.ts` exports `menus` (sidebar items) and `routes` (route definitions). Add an entry to both:

```ts
import { createLazyRoute } from '@/utils/RouteLoader'
import { ROUTES } from '@/helpers/navigation'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const YourPage = createLazyRoute(() => import('./components/YourPage'))

menus: [
  {
    title: 'menus.your_page',
    icon: '<icon>',
    path: ROUTES.YOUR_PAGE,
    permission: <READ_PERM>,
    resourceKey: ADMIN_UI_RESOURCES.<Resource>,
  },
],

routes: [
  {
    component: YourPage,
    path: ROUTES.YOUR_PAGE,
    permission: <WRITE_PERM>,
    resourceKey: ADMIN_UI_RESOURCES.<Resource>,
  },
],
```

`createLazyRoute` does a dynamic import so the page's code is split into its own chunk — the user only downloads it when they actually navigate to the route. `resourceKey` ties the entry to a Cedarling resource so the host can hide the sidebar item for users who lack the permission.

### Step 4 — Gate the render and any actions

Inside the component, use `useCedarling()` to decide whether to render and which actions to show. The full pattern is in [cedarling.md](./cedarling.md); the short version is at [Add an authorization (Cedarling) check](#add-an-authorization-cedarling-check) below.

### Step 5 — Translations

Add the `menus.your_page` key and every UI string the page uses to **all four** locale files: `app/locales/{en,es,fr,pt}/translation.json`. Updating only English is a silent bug — the i18n fallback chain will hide it in English QA and surface it the first time a non-English speaker opens the page.

### Step 6 — Test

Add a sibling test under `__tests__/`:

```text
plugins/<plugin>/__tests__/components/YourPage.test.tsx
```

The full testing setup is documented in [testing.md](./testing.md). At a minimum, mount the page through `AppTestWrapper`, mock `useCedarling`, and assert that the gated UI behaves correctly when permissions are granted and when they are not.

## Add a new plugin

A new plugin is appropriate when the feature is large enough to own its own folder — its own components, its own Redux state if needed, its own audit constants, its own data hooks. Look at `plugins/scim/` for a small, self-contained reference.

### Step 1 — Create the folder

Copy the layout of an existing plugin. The standard structure:

```text
plugins/<name>/
├── components/         # the plugin's React components
├── redux/              # slices + sagas if the plugin has client state
├── helper/             # plugin-local helpers
├── hooks/              # plugin-local hooks
├── types/              # TS types for the plugin
└── plugin-metadata.ts  # registration entry point
```

Not every folder is required. Many plugins have no `redux/` because they only call Config API hooks.

### Step 2 — Write `plugin-metadata.ts`

Export the menus, routes, reducers, and sagas the plugin contributes:

```ts
import { createLazyRoute } from '@/utils/RouteLoader'
import { ROUTES } from '@/helpers/navigation'

export default {
  menus: [
    /* … */
  ],
  routes: [
    /* … */
  ],
  reducers: [
    /* { name, reducer } … */
  ],
  sagas: [
    /* … */
  ],
}
```

A plugin that contributes only routes can omit `reducers` and `sagas`.

### Step 3 — Register in `plugins.config.json`

The host resolvers iterate over `admin-ui/plugins.config.json`. Add an entry:

```json
{ "order": 99, "key": "my-feature", "metadataFile": "./my-feature/plugin-metadata" }
```

`order` controls where the plugin's parent menu group appears in the sidebar; `key` is a stable identifier; `metadataFile` is the relative path the resolvers import.

### Step 4 — Verify

Run `npm start`, sign in, and confirm the sidebar entry appears and the route resolves. If the sidebar entry is missing but the URL still works, the plugin's `menus` array is empty or its metadata file failed to load — check the dev console for the resolver's `devLogger.warn`.

> [!IMPORTANT]
> Don't hand-edit `plugins/PluginMenuResolver.ts`, `plugins/PluginReducersResolver.ts`, or `plugins/PluginSagasResolver.ts`. They use Vite's `import.meta.glob` mechanism, which is sensitive to how the references are structured — refactoring breaks HMR.

See [architecture.md](./architecture.md#the-plugin-loader) for what the resolvers do at runtime.

## Call the Config API

Every backend call in the Admin UI goes through an Orval-generated hook. Never write a hand-rolled `fetch` or `axios.post` for Config API operations — see [config-api.md](./config-api.md) for the full pipeline.

```ts
import {
  useGet<Operation>,
  usePut<Operation>,
  getGet<Operation>QueryKey,
  type <Schema>,
} from 'JansConfigApi'

// Read
const { data, isLoading } = useGet<Operation>()

// Write
const { mutateAsync } = usePut<Operation>({
  mutation: {
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getGet<Operation>QueryKey() }),
  },
})
```

A few rules:

- Always invalidate the matching query key on success — otherwise the cache will show stale data after a successful write.
- Always use the generated `getGet<Operation>QueryKey()` helper. Hand-written keys drift.
- If the OpenAPI spec changed upstream, regenerate the client with `npm run api:orval`. See [config-api.md](./config-api.md#regenerating-the-client) for what the regenerate script actually does.

## Add a Redux slice and saga

> [!NOTE]
> Reach for Redux **only** for client / auth / session / theme state. Server data goes through React Query — see [Call the Config API](#call-the-config-api).

The slice + saga pattern is for state that lives in the browser only: a workflow flag, a multi-step form's intermediate state, a value that needs to survive between page navigations, etc.

### Step 1 — Create the slice

```text
app/redux/features/yourSlice.ts
app/redux/features/types/yourSliceTypes.ts
```

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { YourState } from './types/yourSliceTypes'

const initialState: YourState = { /* … */ }

const yourSlice = createSlice({
  name: 'your',
  initialState,
  reducers: {
    fetchSomething: (state) => { state.loading = true },
    fetchSomethingResponse: (state, action: PayloadAction</* … */>) => { /* … */ },
  },
})

export const { fetchSomething, fetchSomethingResponse } = yourSlice.actions
export default yourSlice.reducer
```

### Step 2 — Wire the reducer

Register the reducer into the root reducer under `app/redux/`. Look at how an existing slice does this — the registration pattern is mechanical.

### Step 3 — (Optional) Saga for side effects

If the slice needs to fire async work — calling an API, waiting for another action, polling — add a saga:

```text
app/redux/sagas/YourSaga.ts
```

```ts
import { call, put } from 'redux-saga/effects'
import { takeLatest } from './effects'
import { fetchSomething, fetchSomethingResponse } from '../features/yourSlice'

function* handleFetch() {
  const data = yield call(/* api fn */)
  yield put(fetchSomethingResponse(data))
}

export default function* yourSaga() {
  yield takeLatest(fetchSomething.type, handleFetch)
}
```

Wire the saga into the root saga, then test it with `redux-saga-test-plan` — see [testing.md](./testing.md#writing-a-saga--reducer-test).

### Gotcha — magic-string dispatches

If you dispatch via `dispatch({ type: 'your/fetchSomething' })` (instead of the imported action creator), knip will flag the reducer as unused and may delete it on the next dead-code sweep. **Always import the action creator.**

## Add a form (Formik + Yup)

Forms in the Admin UI use **Formik** (form state) paired with **Yup** (validation schema). MUI inputs read the Formik values and errors. The pattern is consistent across the codebase — look at any plugin's edit / create page for a concrete example.

```ts
import { Formik } from 'formik'
import * as Yup from 'yup'
import { REGEX_<NAME> } from '@/utils/regex'

const schema = Yup.object({
  fieldName: Yup.string().matches(REGEX_<NAME>, 'errors.invalid_format').required(),
})

<Formik
  initialValues={initialValues}
  validationSchema={schema}
  onSubmit={async (values) => {
    // await mutateAsync(values)
  }}
>
  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, dirty }) => (
    /* MUI inputs reading values/errors */
  )}
</Formik>
```

Rules to follow:

- **Every regex literal goes in `app/utils/regex.ts`** with the `REGEX_` prefix. No inline regex in components or validation schemas. See [conventions.md](./conventions.md#regex).
- **Validation messages are translation keys**, never English strings. `errors.invalid_format` is right; `'Invalid format'` is wrong — the message will not be translated.
- **Disable the submit button on `!dirty || isSubmitting`.** Submitting an unchanged form produces a noop request that still hits the API, and double-submitting a slow request creates two writes.

## Add an authorization (Cedarling) check

The full version of this is in [cedarling.md](./cedarling.md). For a quick reference:

```ts
import { useEffect, useMemo } from 'react'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

const RESOURCE_ID = ADMIN_UI_RESOURCES.<YourFeature>
const SCOPES = CEDAR_RESOURCE_SCOPES[RESOURCE_ID]

const { authorizeHelper, hasCedarReadPermission, hasCedarWritePermission } = useCedarling()

useEffect(() => {
  if (SCOPES?.length) authorizeHelper(SCOPES)
}, [authorizeHelper])

const canRead = useMemo(() => hasCedarReadPermission(RESOURCE_ID), [hasCedarReadPermission])
const canWrite = useMemo(() => hasCedarWritePermission(RESOURCE_ID), [hasCedarWritePermission])
```

If the resource is new, add it to `app/cedarling/utility/resources.ts` and add the corresponding Cedar policy to **both** `app/cedarling/config/policy-store-dev.json` and `policy-store-prod.json`. A policy missing from prod returns "deny" with no obvious error.

## Add an audit record

Every write through the Config API should produce an audit entry. The full mechanism is in [config-api.md](./config-api.md#audit-logging).

The minimal pattern:

```ts
import { CREATE, useAuditContext, createSuccessAuditInit } from '@/audit'
import { <RESOURCE_CONSTANT> } from 'Plugins/<self>/redux/audit/Resources' // or @/audit

const auditContext = useAuditContext()

await mutateAsync(payload)
const audit = createSuccessAuditInit(auditContext)
// pass `audit`, action constant (CREATE/UPDATE/DELETION/…), and the resource
// through the project's existing audit helper for that flow
```

Most plugins already have a `useXxxAudit` hook that encodes the right shape (`useWebhookAudit`, `useAssetAudit`, etc.). Reuse those instead of hand-wiring the dispatch — they keep audit payloads consistent.

## Add a constant

The placement rule for constants is short. Pick the destination by where the constant is used:

| Where it's used            | Where it lives                                                         |
| -------------------------- | ---------------------------------------------------------------------- |
| Multiple plugins or `app/` | `app/constants/<file>.ts`, re-exported via `app/constants/index.ts`    |
| One plugin only            | That plugin's own `common/Constants.ts` (or `components/constants.ts`) |
| One component only         | A local `const` is fine                                                |

No inline magic strings anywhere — that includes storage keys, language codes, audit actions, status values, attribute names, date formats, and route paths. The full conventions are in [conventions.md](./conventions.md#constants).

## Update translations

Translations live in `app/locales/<lang>/translation.json`. The project supports four locales:

```text
app/locales/
├── en/translation.json
├── es/translation.json
├── fr/translation.json
└── pt/translation.json
```

**Every key gets added to every file in the same commit.** If you only update `en/`, the i18n fallback chain falls back to the English value and the bug is invisible in English QA. It will surface the first time a non-English user opens the page — at which point fixing it is much more disruptive than catching it at commit time.

If you don't speak Spanish / French / Portuguese, copy the English value and flag it in the PR description; a translator can replace it later.

## Where to read next

- [architecture.md](./architecture.md) — the host / plugin split that all of these recipes plug into
- [conventions.md](./conventions.md) — naming, types, imports, styling, i18n rules
- [config-api.md](./config-api.md) — full Config API + Orval pipeline
- [cedarling.md](./cedarling.md) — full Cedarling authorization story
- [testing.md](./testing.md) — how to test the things you build with these recipes
