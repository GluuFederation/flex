# Tech stack

One-page reference for every notable library — what it is, where it's wired, when to reach for it.

## At a glance

| Concern             | Library                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Language            | TypeScript 6 (strict)                                                                     |
| Framework           | React 18                                                                                  |
| Build               | Vite 8 (Rolldown bundler)                                                                 |
| State (client/auth) | Redux Toolkit + redux-saga + redux-persist                                                |
| State (server)      | TanStack React Query 5                                                                    |
| HTTP                | axios (driven by Orval-generated hooks)                                                   |
| Forms               | Formik + Yup                                                                              |
| UI                  | MUI (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) + Emotion + tss-react |
| Legacy UI           | reactstrap / bootstrap (phasing out)                                                      |
| Routing             | React Router 6                                                                            |
| I18n                | i18next + react-i18next                                                                   |
| Charts              | Recharts                                                                                  |
| Code editor         | react-ace                                                                                 |
| File uploads        | react-dropzone                                                                            |
| Auth                | OpenID AppAuth (`@openid/appauth`) + Cedarling                                            |
| Testing             | Jest + Testing Library                                                                    |
| Lint / format       | ESLint 9 + Prettier                                                                       |
| Dead-code           | knip                                                                                      |
| Bundle analysis     | Sonda                                                                                     |
| Git hooks           | Husky                                                                                     |
| Date                | dayjs                                                                                     |

## What each library is

### Framework / runtime

- **React + React DOM** — UI runtime. Bootstrapped in [`app/index.tsx`](../app/index.tsx).
- **React Router** — client-side routing. Routes in `app/routes/` plus per-plugin contributions via `plugin-metadata.ts`.
- **Vite (Rolldown)** — dev server + production bundler. Config in [`vite.config.ts`](../vite.config.ts) (chunking + `admin-ui:env-config` plugin). See [build-deploy.md](./build-deploy.md#chunking). Never use a `manualChunks` callback.

### State

Two libraries, intentional split — see [architecture.md](./architecture.md#state-management).

- **Redux Toolkit** — store in `app/redux/`. Client / auth / session / theme state.
- **redux-saga** — generator-based side-effect runtime; sagas in `app/redux/sagas/`. Auth flows, polling, multi-step effects.
- **redux-persist** — persists chosen slices to storage. Keeps user signed in across reloads; restores theme / language before first paint.
- **TanStack React Query 5** — server-state cache via Orval-generated hooks (`useGet*`, `usePut*`). Use on **every** Config API read/write.

### HTTP / API client

- **axios** — single instance in [`orval/axiosInstance.ts`](../orval/axiosInstance.ts) (base-URL fallback + bearer + `withCredentials`). Never call directly; it backs Orval hooks.
- **Orval** — generates the typed client + React Query hooks from the merged OpenAPI spec. Run `npm run api:orval` after upstream spec changes. See [config-api.md](./config-api.md).

### Forms

- **Formik** — form state (values, touched, errors, submission).
- **Yup** — validation schema, paired with Formik. See [recipes.md](./recipes.md#add-a-form-formik--yup).

### UI

- **MUI** (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) — default for new code.
- **Emotion + tss-react** — CSS-in-JS engine MUI rides on; `tss-react` is `makeStyles`-style. Use for component-scoped styles.
- **reactstrap / bootstrap** — legacy. Don't add new usages.

### Domain

- **i18next + react-i18next** — `app/i18n.ts`; locales under `app/locales/{en,es,fr,pt}/`. Update all four when adding a key.
- **dayjs** — light date library; use wrappers in `app/utils/dayjsUtils.ts`.
- **Recharts** — dashboard / metrics charts under `plugins/admin/`.
- **react-ace** — Ace editor as React component; used in `plugins/scripts/`.
- **react-dropzone** — drag-and-drop file pickers (SSA upload, generic file pickers).
- **@openid/appauth** — OIDC PKCE client. Drives sign-in via AuthSaga. See [auth.md](./auth.md).
- **Cedarling (`@janssenproject/cedarling_wasm`)** — Cedar policy engine compiled to WASM. Every permission check goes through `useCedarling()`. See [cedarling.md](./cedarling.md).

### Build / quality / dev-only

- **Sonda** — bundle analyzer; `ANALYZE=true npm run build:prod` emits `dist/sonda-report.{html,json}`.
- **knip** — unused files / exports / deps via `npm run preview:prod:analyze`. Watch for magic-string Redux dispatches — knip can't see them and may delete the reducer.
- **Jest + Testing Library** — `__tests__/` siblings throughout `app/` and `plugins/`. See [testing.md](./testing.md).
- **ESLint + Prettier** — config in `eslint.config.cjs`; enforced via `.husky/pre-commit`. Never disable rules.
- **Husky** — `.husky/pre-commit` is the only enforcement point. CI is artifact-build only.

## Build pipeline at a glance

```text
source ──(Vite + Rolldown)──► dist/ ──► (Jenkins | Janssen installer) ──► browser
```

Same `dist/` runs everywhere; env-specific values are injected at runtime via `env-config.js`. See [build-deploy.md](./build-deploy.md).
