# Recipes

Short walkthroughs for common tasks. Each recipe names the files, the convention, and a working skeleton.

## Add a page inside an existing plugin

**Files:**

```text
plugins/<plugin>/components/YourPage.tsx
plugins/<plugin>/components/types.ts
plugins/<plugin>/components/hooks/useYourPageApi.ts   # if needed
```

**Steps:**

1. Add the route constant to `app/helpers/navigation.ts`:

   ```ts
   YOUR_PAGE: `${PLUGIN_BASE_PATHS.<PLUGIN>}/your-page`,
   ```

2. Register in the plugin's `plugin-metadata.ts`:

   ```ts
   const YourPage = createLazyRoute(() => import('./components/YourPage'))

   menus: [{ title: 'menus.your_page', icon: '<icon>', path: ROUTES.YOUR_PAGE,
            permission: <READ_PERM>, resourceKey: ADMIN_UI_RESOURCES.<Resource> }]
   routes: [{ component: YourPage, path: ROUTES.YOUR_PAGE,
            permission: <WRITE_PERM>, resourceKey: ADMIN_UI_RESOURCES.<Resource> }]
   ```

3. Gate the render with `useCedarling()` — see [Add an authorization check](#add-an-authorization-check).
4. Add the `menus.your_page` key to **all four** `app/locales/{en,es,fr,pt}/translation.json`.
5. Add a sibling test under `plugins/<plugin>/__tests__/components/YourPage.test.tsx` — see [testing.md](./testing.md).

## Add a new plugin

Copy a small plugin (`plugins/scim/`) as a template, then register it in `plugins.config.json`:

```json
{ "order": 99, "key": "my-feature", "metadataFile": "./my-feature/plugin-metadata" }
```

`order` controls sidebar position. Run `npm start` and confirm the sidebar entry resolves.

> [!IMPORTANT]
> Don't refactor `plugins/PluginMenuResolver.ts`, `PluginReducersResolver.ts`, or `PluginSagasResolver.ts` — they rely on Vite's `import.meta.glob` and break HMR if restructured.

## Call the Config API

Every backend call uses an Orval-generated hook. See [config-api.md](./config-api.md).

```ts
import { useGet<Op>, usePut<Op>, getGet<Op>QueryKey, type <Schema> } from 'JansConfigApi'

const { data, isLoading } = useGet<Op>()

const { mutateAsync } = usePut<Op>({
  mutation: {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getGet<Op>QueryKey() }),
  },
})
```

Rules:

- Always invalidate the matching query key on success — otherwise the cache shows stale data.
- Use `getGet<Op>QueryKey()`; hand-written keys drift.
- After an upstream OpenAPI change, run `npm run api:orval`.

## Add a Redux slice and saga

> [!NOTE]
> Reach for Redux **only** for client / auth / session state. Server data goes through React Query.

**Files:**

```text
app/redux/features/yourSlice.ts
app/redux/features/types/yourSliceTypes.ts
app/redux/sagas/YourSaga.ts            # if side effects needed
```

**Slice:**

```ts
const yourSlice = createSlice({
  name: 'your',
  initialState,
  reducers: {
    fetchSomething: (state) => { state.loading = true },
    fetchSomethingResponse: (state, action: PayloadAction</* … */>) => { /* … */ },
  },
})
```

**Saga:**

```ts
function* handleFetch() {
  const data = yield call(/* api fn */)
  yield put(fetchSomethingResponse(data))
}

export default function* yourSaga() {
  yield takeLatest(fetchSomething.type, handleFetch)
}
```

Register the reducer and saga at the root — copy an existing slice. Test via `redux-saga-test-plan`.

> [!WARNING]
> **Always import the action creator.** Dispatching `{ type: 'your/fetchSomething' }` as a string makes knip flag the reducer as unused and delete it.

## Add a form (Formik + Yup)

```ts
import { Formik } from 'formik'
import * as Yup from 'yup'
import { REGEX_<NAME> } from '@/utils/regex'

const schema = Yup.object({
  fieldName: Yup.string().matches(REGEX_<NAME>, 'errors.invalid_format').required(),
})
```

Rules:

- Every regex literal in `app/utils/regex.ts` with `REGEX_` prefix — never inline.
- Validation messages are translation keys (`errors.invalid_format`), never English strings.
- Disable submit on `!dirty || isSubmitting` to avoid noop and double-submit writes.

## Add an authorization check

Full version in [cedarling.md](./cedarling.md). Short form:

```ts
const RESOURCE_ID = ADMIN_UI_RESOURCES.<YourFeature>
const SCOPES = CEDAR_RESOURCE_SCOPES[RESOURCE_ID]

const { authorizeHelper, hasCedarReadPermission, hasCedarWritePermission } = useCedarling()

useEffect(() => { if (SCOPES?.length) authorizeHelper(SCOPES) }, [authorizeHelper])
const canRead = useMemo(() => hasCedarReadPermission(RESOURCE_ID), [hasCedarReadPermission])
const canWrite = useMemo(() => hasCedarWritePermission(RESOURCE_ID), [hasCedarWritePermission])
```

New resource → add it to `app/cedarling/utility/resources.ts` **and** the policy to both `policy-store-dev.json` and `policy-store-prod.json`. A missing prod policy returns "deny" with no error.

## Add an audit record

Full mechanism in [config-api.md](./config-api.md#audit-logging).

```ts
import { CREATE, useAuditContext, createSuccessAuditInit } from '@/audit'

const auditContext = useAuditContext()
await mutateAsync(payload)
const audit = createSuccessAuditInit(auditContext)
```

Most plugins already have a `useXxxAudit` hook — reuse it instead of hand-wiring.

## Add a constant

| Used in                    | Lives in                                                    |
| -------------------------- | ----------------------------------------------------------- |
| Multiple plugins or `app/` | `app/constants/<file>.ts` (re-exported via `index.ts`)      |
| One plugin only            | Plugin's `common/Constants.ts` or `components/constants.ts` |
| One component only         | Local `const`                                               |

No inline magic strings — storage keys, language codes, audit actions, status values, attribute names, date formats, route paths all go through constants.

## Update translations

Keys go in `app/locales/{en,es,fr,pt}/translation.json` — **every key in every file, same commit.** English-only updates silently fall back through i18n and the bug surfaces the first time a non-English user opens the page.

If you don't speak the language, copy the English value and flag it in the PR; a translator replaces it later.
