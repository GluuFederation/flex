# Recipes

Short, opinionated walkthroughs for tasks that come up every week. Each one points at the file you'll edit and the rules you'll need.

---

## Add a new page (inside an existing plugin)

1. **Create the component**

   ```text
   plugins/<plugin>/components/YourPage.tsx
   plugins/<plugin>/components/types.ts        # extend with YourPage types
   plugins/<plugin>/components/hooks/useYourPageApi.ts   # data hook
   ```

2. **Add a route constant** in `app/helpers/navigation.ts` — never hard-code paths.

   ```ts
   YOUR_PAGE: `${PLUGIN_BASE_PATHS.<PLUGIN>}/your-page`,
   ```

3. **Register the route + sidebar entry** in the plugin's `plugin-metadata.ts`:

   ```ts
   import { createLazyRoute } from '@/utils/RouteLoader'
   import { ROUTES } from '@/helpers/navigation'
   import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

   const YourPage = createLazyRoute(() => import('./components/YourPage'))

   menus: [{ title: 'menus.your_page', icon: '<icon>', path: ROUTES.YOUR_PAGE,
             permission: <READ_PERM>, resourceKey: ADMIN_UI_RESOURCES.<Resource> }],
   routes: [{ component: YourPage, path: ROUTES.YOUR_PAGE,
              permission: <WRITE_PERM>, resourceKey: ADMIN_UI_RESOURCES.<Resource> }],
   ```

4. **Gate render + actions** with `useCedarling()` — see [cedarling.md](./cedarling.md).
5. **Translations** — add the `menus.your_page` key and any UI strings to **all four** locale files under `app/locales/{en,es,fr,pt}/`.
6. **Test** — a sibling `__tests__/components/YourPage.test.tsx`. See [testing.md](./testing.md).

---

## Add a new plugin

Don't hand-edit the loader files (`plugins/PluginMenuResolver.ts` / `…ReducersResolver.ts` / `…SagasResolver.ts`) — they're runtime-sensitive.

```bash
npm run plugin:add
```

That scaffolds:

- `plugins/<name>/` with the standard subfolders
- a `plugin-metadata.ts` skeleton
- registers the plugin in `plugins.config.json`

Implement under the plugin folder, then check that the route resolves and the sidebar entry appears for a user with the relevant Cedarling scope.

To remove: `npm run plugin:remove`.

See [architecture.md](./architecture.md#-plugin-loader) for what the resolvers do at runtime.

---

## Call the Config API

Always use an Orval-generated hook — never a hand-rolled axios call.

```ts
import {
  useGet<Operation>,
  usePut<Operation>,
  getGet<Operation>QueryKey,
  type <Schema>,
} from 'JansConfigApi'

const { data, isLoading } = useGet<Operation>()

const { mutateAsync } = usePut<Operation>({
  mutation: {
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getGet<Operation>QueryKey() }),
  },
})
```

If the OpenAPI changed, regenerate: `npm run api:orval`. See [config-api.md](./config-api.md).

---

## Add a Redux slice + saga

Reach for Redux **only** for client/auth/session/theme state. Server data goes through React Query (see above).

1. **Create the slice**

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
       fetchSomethingResponse: (state, action: PayloadAction<…>) => { /* … */ },
     },
   })

   export const { fetchSomething, fetchSomethingResponse } = yourSlice.actions
   export default yourSlice.reducer
   ```

2. **Wire the reducer** into the root reducer in `app/redux/`.

3. **(Optional) Saga** for side effects:

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

   Wire it into the root saga, then test it with `redux-saga-test-plan`.

4. **Watch out for magic-string dispatches** — if you dispatch via `dispatch({ type: 'your/fetchSomething' })` (instead of the imported action creator), knip will flag the reducer as unused and may delete it. Always import the action creator.

---

## Add a form (Formik + Yup)

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
  onSubmit={async (values) => { /* mutateAsync(values) */ }}
>
  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, dirty }) => (
    /* MUI inputs reading values/errors */
  )}
</Formik>
```

Rules:

- Every regex literal goes into `app/utils/regex.ts` with `REGEX_` prefix. No inline regex.
- Validation messages are translation keys (e.g. `errors.invalid_format`), not English strings.
- Disable the submit button on `!dirty || isSubmitting`.

---

## Add an authorization (Cedarling) check

See [cedarling.md](./cedarling.md) for the full version. Quick version:

```ts
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const RESOURCE_ID = ADMIN_UI_RESOURCES.<YourFeature>
const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
const canRead = useMemo(() => hasCedarReadPermission(RESOURCE_ID), [hasCedarReadPermission])
const canWrite = useMemo(() => hasCedarWritePermission(RESOURCE_ID), [hasCedarWritePermission])
```

If the resource is new, add it to `app/cedarling/utility/resources.ts` and add the policy to **both** `policy-store-dev.json` and `policy-store-prod.json`.

---

## Add an audit record

Every write through the Config API should produce an audit entry. See [config-api.md](./config-api.md#audit-logging).

```ts
import { CREATE, useAuditContext, createSuccessAuditInit } from '@/audit'
import { <RESOURCE_CONSTANT> } from 'Plugins/<self>/redux/audit/Resources' // or @/audit

const auditContext = useAuditContext()

await mutateAsync(payload)
const audit = createSuccessAuditInit(auditContext)
// pass `audit`, action constant (CREATE/UPDATE/DELETION/…), and the resource
// through the project's existing audit helper for that flow
```

Reuse the audit hook your plugin already has (`useWebhookAudit`, `useAssetAudit`, etc.) instead of hand-wiring — they encode the right shape.

---

## Add a constant

| Where it's used            | Where it lives                                                         |
| -------------------------- | ---------------------------------------------------------------------- |
| Multiple plugins or `app/` | `app/constants/<file>.ts`, re-exported via `app/constants/index.ts`    |
| One plugin only            | that plugin's own `common/Constants.ts` (or `components/constants.ts`) |
| One component only         | a local `const` is fine                                                |

No inline magic strings (storage keys, language codes, audit actions, status values, attribute names, date formats). See [conventions.md](./conventions.md#constants).

---

## Update translations

Every locale file gets every key. If a key only exists in `en`, the i18n fallback chain hides the bug — it'll never bite in English-only QA.

```text
app/locales/
├── en/translation.json
├── es/translation.json
├── fr/translation.json
└── pt/translation.json
```

Update all four in the same commit.
