# Tech Stack

| Concern             | Library                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Language            | TypeScript 6 (strict)                                                                     |
| Framework           | React 18                                                                                  |
| Build               | Vite 8 (Rolldown bundler)                                                                 |
| Bundle analysis     | Sonda                                                                                     |
| State (client/auth) | Redux Toolkit + redux-saga + redux-persist                                                |
| State (server)      | TanStack React Query 5                                                                    |
| HTTP client         | axios (driven by Orval-generated hooks)                                                   |
| Forms               | Formik + Yup                                                                              |
| UI                  | MUI (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) + Emotion + tss-react |
| Legacy UI           | reactstrap / bootstrap (being phased out)                                                 |
| Routing             | React Router 6                                                                            |
| I18n                | i18next + react-i18next (locales loaded lazily)                                           |
| Charts              | Recharts                                                                                  |
| Code editor         | react-ace                                                                                 |
| File uploads        | react-dropzone                                                                            |
| Auth                | OpenID AppAuth (`@openid/appauth`) + Cedarling (Jans authz)                               |
| Testing             | Jest + Testing Library                                                                    |
| Lint / format       | ESLint 9 + Prettier                                                                       |
| Dead-code detection | knip                                                                                      |
| Git hooks           | Husky                                                                                     |
| Date                | dayjs                                                                                     |

## What each library is (and where it lives)

Each entry: **what it is** → **where it's wired up** → **when you reach for it**. Libraries not listed are transitive (e.g. `@emotion/*` rides MUI) or build-time deps with no runtime surface (`@babel/*`, `autoprefixer`).

### Framework & runtime

- **React + React DOM** — the UI runtime; component model, hooks, rendering. Bootstrapped in `app/index.tsx`. You touch it every time you write a component.
- **React Router** — declarative client-side routing; URL ↔ component tree. Routes live in `app/routes/`. Reach for it when adding/removing a route or auth gate.
- **Vite (Rolldown bundler)** — dev server + production bundler; replaces webpack. Configured in `vite.config.ts` — chunking and the dev env-config plugin live there. Don't switch to a `manualChunks` callback ([build-deploy.md](./build-deploy.md#-do-not-use-the-manualchunks-function-form)).

### State

- **Redux Toolkit** — official Redux + slice/reducer ergonomics. Store in `app/redux/`. For client/auth/session/theme state.
- **redux-saga** — generator-based side-effect runtime (think: cancellable async). Sagas live next to slices in `app/redux/`. Used for auth flows, polling, multi-step effects.
- **redux-persist** — persists chosen Redux slices to `localStorage`/`sessionStorage` across reloads. Wired into the store in `app/redux/`.
- **TanStack React Query (v5)** — server-state cache: request dedup, caching, retry, stale-while-revalidate. Used via Orval-generated hooks (`useGet*`, `usePut*`). Reach for it on **every** Config API read/write ([config-api.md](./config-api.md)).

### HTTP / API client

- **axios** — HTTP client. Single instance in `app/redux/api/axios.ts` (base URL fallback chain + interceptors). Never call axios directly — it backs the Orval hooks.
- **Orval** — generates a typed TypeScript client + React Query hooks from the OpenAPI spec. Run `npm run api:orval` after the spec changes. Configured in `orval.config.ts`.

### Forms

- **Formik** — form state (values, touched, errors, submission). Used per-feature under `plugins/<name>/components/`.
- **Yup** — schema validation paired with Formik. Always use them together for non-trivial forms.

### UI

- **MUI (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`)** — Material design components, icons, date pickers. The default UI library.
- **Emotion + tss-react** — CSS-in-JS engine MUI rides on; `tss-react` is a `makeStyles`-style helper that plays nicely with strict React/MUI v5. Use for component-scoped styles.
- **reactstrap / bootstrap** — legacy Bootstrap-based UI from earlier in the project's life. **Phasing out — don't add new usages.**

### Domain libraries

- **i18next + react-i18next** — translations / `t()` hook. `app/i18n.ts` bootstraps; locale JSON lives in `app/locales/{en,es,fr,pt}/`. Update all four locales when adding a key.
- **dayjs** — light date library (Moment-compatible API, much smaller). Use the wrappers in `app/utils/dayjsUtils.ts`; never inline `new Date()` formatting.
- **Recharts** — composable React charts. Used in dashboard/metrics components under `plugins/admin/`.
- **react-ace** — Ace code editor as a React component. Used in script-editing components (e.g. `plugins/scripts/`).
- **react-dropzone** — drag-and-drop file upload zones via `useDropzone`. Used in `app/utils/UploadSSA.tsx` and `app/routes/Apps/Gluu/GluuUploadFile.tsx` for SSA upload and generic file pickers.
- **@openid/appauth** — OIDC PKCE client library (AppAuth-JS). Drives sign-in and token refresh from the auth slice/saga in `app/redux/`.
- **Cedarling (`@janssenproject/cedarling_wasm`)** — Jans-provided Cedar policy engine compiled to WASM. Used for every permission check via `app/cedarling/` and `useCedarling()` ([cedarling.md](./cedarling.md)).

### Build / quality / dev-only

- **Sonda** — bundle analyzer (treemap + used/unused-export report). Enabled by `ANALYZE=true npm run build:prod`; emits `dist/sonda-report.{html,json}`.
- **knip** — finds unused files, exports, dependencies. Run via `npm run knip` or surfaced by `preview:prod:analyze`. Watch out for magic-string Redux dispatches (knip can't see them).
- **Jest + Testing Library** — unit / component tests. `__tests__/` siblings throughout `app/` and `plugins/`.
- **ESLint + Prettier** — lint + formatter. Config in `eslint.config.cjs` (Prettier uses defaults). Enforced via `.husky/pre-commit`. Never disable rules to silence failures.
- **Husky** — git-hook runner. `.husky/pre-commit` is the **only** place lint/type-check enforcement runs; CI is just an artifact builder ([build-deploy.md](./build-deploy.md#ci--jenkins)).

## Why two state systems

- **Server data** changes outside our control and benefits from request dedup, caching, retry, and stale-while-revalidate — that's React Query.
- **Auth, session, theme, sidebars, webhook dialogs, audit** — pure client state that multiple components observe. Redux is the better fit there.

Don't propose collapsing the two. The split is intentional.

## Why Cedarling

Authorization decisions (who can see/edit what) are not hard-coded in the UI; they come from a Cedar policy store fetched at runtime. See [cedarling.md](./cedarling.md).

## Build pipeline at a glance

```text
source ──(Vite + Rolldown)──► dist/  ──► (Jenkins | Janssen installer) ──► browser
```

See [build-deploy.md](./build-deploy.md) for chunking, bundle analysis, and the two deployment paths.
