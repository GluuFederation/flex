# Tech stack

One-page reference for every notable library. What it is, where it's wired, when to reach for it.

## At a glance

| Concern             | Library                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Language            | TypeScript 6 (strict)                                                                       |
| Framework           | React 18                                                                                    |
| Build               | Vite 8 (Rolldown bundler)                                                                   |
| State (client/auth) | Redux Toolkit (+ listener middleware) + redux-persist                                       |
| State (server)      | TanStack React Query 5                                                                      |
| HTTP                | axios (driven by Orval-generated hooks)                                                     |
| Forms               | Formik + Yup                                                                                |
| UI                  | MUI 9 (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) + Emotion + tss-react |
| Routing             | React Router 7                                                                              |
| I18n                | i18next + react-i18next                                                                     |
| Charts              | Recharts                                                                                    |
| Code editor         | react-ace                                                                                   |
| File uploads        | react-dropzone                                                                              |
| Auth                | OpenID AppAuth (`@openid/appauth`) + Cedarling                                              |
| Testing             | Jest + Testing Library                                                                      |
| Lint / format       | ESLint 9 + Prettier                                                                         |
| Dead-code           | knip                                                                                        |
| Bundle analysis     | Sonda                                                                                       |
| Git hooks           | Husky                                                                                       |
| Date                | dayjs                                                                                       |

## What each library is

### Framework / runtime

- **React + React DOM**: UI runtime. Bootstrapped in [`app/index.tsx`](../app/index.tsx).
- **React Router**: client-side routing. Routes in `app/routes/` plus per-plugin contributions via `plugin-metadata.ts`.
- **Vite (Rolldown)**: dev server + production bundler. Config in [`vite.config.ts`](../vite.config.ts) (chunking + `admin-ui:env-config` plugin). See [build-deploy.md](./build-deploy.md#chunking). Never use a `manualChunks` callback.

### State

Two libraries, intentional split. See [architecture.md](./architecture.md#state-management).

- **Redux Toolkit**: store in `app/redux/`. Client / auth / session / theme state.
- **RTK listener middleware**: side-effect runtime for async flows (auth, license, webhooks). Core listeners in `app/redux/listeners/`, per-plugin listeners in `plugins/*/redux/listeners/`. A trigger action dispatched from a component runs the matching listener `effect`; `cancelActiveListeners()` gives takeLatest semantics.
- **redux-persist**: persists chosen slices to storage. Keeps user signed in across reloads. Restores theme / language before first paint.
- **TanStack React Query 5**: server-state cache via Orval-generated hooks (`useGet*`, `usePut*`). Use on **every** Config API read/write.

### HTTP / API client

- **axios**: single instance in [`orval/axiosInstance.ts`](../orval/axiosInstance.ts) (base-URL fallback + bearer + `withCredentials`). Never call directly. It backs Orval hooks.
- **Orval**: generates the typed client + React Query hooks from the merged OpenAPI spec. Run `npm run api:orval` after upstream spec changes. See [config-api.md](./config-api.md).

### Forms

- **Formik**: form state (values, touched, errors, submission).
- **Yup**: validation schema, paired with Formik. See [recipes.md](./recipes.md#add-a-form-formik--yup).

### UI

- **MUI** (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`): default for all UI code.
- **Emotion + tss-react**: CSS-in-JS engine MUI rides on. `tss-react` is `makeStyles`-style. Use for component-scoped styles.

### Domain

- **i18next + react-i18next**: `app/i18n.ts`. Locales under `app/locales/{en,es,fr,pt}/`. Update all four when adding a key.
- **dayjs**: light date library. Use wrappers in `app/utils/dayjsUtils.ts`.
- **Recharts**: dashboard / metrics charts under `plugins/admin/`.
- **react-ace**: Ace editor as React component. Used in `plugins/scripts/`.
- **react-dropzone**: drag-and-drop file pickers (SSA upload, generic file pickers).
- **@openid/appauth**: OIDC PKCE client. Drives sign-in via the auth listener. See [auth.md](./auth.md).
- **Cedarling (`@janssenproject/cedarling_wasm`)**: Cedar policy engine compiled to WASM. Every permission check goes through `useCedarling()`. See [cedarling.md](./cedarling.md).

### Build / quality / dev-only

- **Sonda**: bundle analyzer. `ANALYZE=true npm run build:prod` emits `dist/sonda-report.{html,json}`.
- **knip**: unused files / exports / deps via `npm run preview:prod:analyze`. Watch for magic-string Redux dispatches. Knip can't see them and may delete the reducer.
- **Jest + Testing Library**: `__tests__/` siblings throughout `app/` and `plugins/`. See [testing.md](./testing.md).
- **ESLint + Prettier**: config in `eslint.config.cjs`. Enforced via `.husky/pre-commit`. Never disable rules.
- **Husky**: `.husky/pre-commit` is the only enforcement point. CI is artifact-build only.

## Build pipeline at a glance

```text
source ──(Vite + Rolldown)──► dist/ ──► (Jenkins | Janssen installer) ──► browser
```

Same `dist/` runs everywhere. Env-specific values are injected at runtime via `env-config.js`. See [build-deploy.md](./build-deploy.md).
