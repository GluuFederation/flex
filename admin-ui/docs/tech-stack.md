# Tech stack

## Introduction

This document is a single-page reference of every notable library and tool the Admin UI uses, what each one is responsible for, where it's wired up in the codebase, and when you reach for it. If a tool is not listed here, it is either transitive (e.g. `@emotion/*` rides MUI) or build-time only with no runtime surface (`@babel/*`, `autoprefixer`).

Read this once when starting on the project. Skim it when you're choosing between two libraries that seem to do the same thing — the entry usually explains which one to reach for and why the other one is not used (or is being phased out).

## At a glance

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

## What each library is

Each entry below answers three things: **what** it is, **where** it's wired up in the codebase, and **when** you reach for it.

### Framework and runtime

- **React + React DOM** — the UI runtime: component model, hooks, rendering. Bootstrapped in [`admin-ui/app/index.tsx`](../app/index.tsx). You touch it every time you write a component.
- **React Router** — declarative client-side routing; URL ↔ component tree. Routes live in `app/routes/` and are also contributed by each plugin's `plugin-metadata.ts`. Reach for it when adding or removing a route, or wiring up an auth gate.
- **Vite (Rolldown bundler)** — dev server and production bundler. Configured in [`admin-ui/vite.config.ts`](../vite.config.ts) — both the chunking strategy and the dev `admin-ui:env-config` plugin live there. See [build-deploy.md](./build-deploy.md#chunking) for the chunking rules; don't switch to a `manualChunks` callback ([build-deploy.md](./build-deploy.md#do-not-use-the-manualchunks-function-form)).

### State

The Admin UI runs two state libraries side by side. The split is intentional — see [Why two state systems](#why-two-state-systems) below.

- **Redux Toolkit** — official Redux + slice / reducer ergonomics. Store in `app/redux/`. For client / auth / session / theme state.
- **redux-saga** — generator-based side-effect runtime (think: cancellable async). Sagas live next to slices in `app/redux/sagas/`. Used for auth flows, polling, multi-step effects.
- **redux-persist** — persists chosen Redux slices to `localStorage` / `sessionStorage` across reloads. Wired into the store under `app/redux/`. Keeps the user signed in across refreshes; restores theme and language before the first paint.
- **TanStack React Query (v5)** — server-state cache: request dedup, caching, retry, stale-while-revalidate. Used via Orval-generated hooks (`useGet*`, `usePut*`). Reach for it on **every** Config API read or write. See [config-api.md](./config-api.md) for the full pipeline.

### HTTP / API client

- **axios** — HTTP client. A single instance lives in [`admin-ui/orval/axiosInstance.ts`](../orval/axiosInstance.ts) (base-URL fallback chain + bearer-token header + `withCredentials`). Never call axios directly — it backs the Orval hooks. Direct calls bypass caching, dedup, retry, and the bearer-token wiring.
- **Orval** — generates a typed TypeScript client + React Query hooks from the merged OpenAPI spec. Run `npm run api:orval` after the upstream spec changes. Configured in [`admin-ui/orval.config.ts`](../orval.config.ts). See [config-api.md](./config-api.md#regenerating-the-client).

### Forms

- **Formik** — form state (values, touched, errors, submission). Used per-feature under `plugins/<name>/components/`.
- **Yup** — schema validation paired with Formik. Always use them together for non-trivial forms — Yup validates, Formik orchestrates. See [recipes.md](./recipes.md#add-a-form-formik--yup).

### UI

- **MUI (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`)** — Material design components, icons, and date pickers. The default UI library for new code.
- **Emotion + tss-react** — the CSS-in-JS engine MUI rides on. `tss-react` is a `makeStyles`-style helper that plays nicely with strict React + MUI v5. Use it for component-scoped styles.
- **reactstrap / bootstrap** — legacy Bootstrap-based UI. **Phasing out — don't add new usages.** Existing usages will be migrated to MUI over time.

### Domain libraries

- **i18next + react-i18next** — translations and the `t()` hook. Bootstrap in `app/i18n.ts`; locale JSON under `app/locales/{en,es,fr,pt}/`. Update all four locales when adding a key — see [conventions.md](./conventions.md#internationalization).
- **dayjs** — light date library (Moment-compatible API, much smaller). Use the wrappers in `app/utils/dayjsUtils.ts`; never inline `new Date()` formatting in components.
- **Recharts** — composable React charts. Used in dashboard / metrics components under `plugins/admin/`.
- **react-ace** — the Ace code editor as a React component. Used in script-editing components, e.g. `plugins/scripts/`.
- **react-dropzone** — drag-and-drop file upload zones via the `useDropzone` hook. Used in `app/utils/UploadSSA.tsx` and `app/routes/Apps/Gluu/GluuUploadFile.tsx` for SSA upload and generic file pickers.
- **@openid/appauth** — OIDC PKCE client library (AppAuth-JS). Drives sign-in and token refresh from the auth slice and AuthSaga in `app/redux/`. See [auth.md](./auth.md#oauth--pkce-sign-in).
- **Cedarling (`@janssenproject/cedarling_wasm`)** — Jans-provided Cedar policy engine compiled to WASM. Used for every permission check via `app/cedarling/` and the `useCedarling()` hook. See [cedarling.md](./cedarling.md).

### Build / quality / dev-only

- **Sonda** — bundle analyzer. Treemap + used / unused export reports. Enabled by `ANALYZE=true npm run build:prod`; emits `dist/sonda-report.{html,json}`. See [build-deploy.md](./build-deploy.md#bundle-analysis).
- **knip** — finds unused files, exports, and dependencies. Surfaced by `npm run preview:prod:analyze`. Watch out for magic-string Redux dispatches — knip can't see them, so dispatching `{ type: 'slice/action' }` (instead of importing the action creator) may cause knip to delete a reducer it can't prove is used.
- **Jest + Testing Library** — unit and component tests. `__tests__/` siblings throughout `app/` and `plugins/`. See [testing.md](./testing.md).
- **ESLint + Prettier** — lint and formatter. Config in `eslint.config.cjs` (Prettier uses repo defaults via `.prettierrc`). Enforced via `.husky/pre-commit`. Never disable rules to silence failures — see [conventions.md](./conventions.md#lint-type-check-format).
- **Husky** — git-hook runner. `.husky/pre-commit` is the **only** place lint / type-check enforcement runs in the merge path; CI is just an artifact builder. See [build-deploy.md](./build-deploy.md#ci--jenkins).

## Why two state systems

The Admin UI does not pick between Redux and React Query — it uses both, deliberately, for different things. Treating that as redundancy and trying to collapse it always makes the code worse.

- **Server data** — anything that comes from the Jans Config API. It changes outside the browser's control and benefits from request dedup, caching, retry, and stale-while-revalidate. **React Query** is built for exactly that.
- **Auth, session, theme, sidebars, license status, Cedarling decisions, plugin workflow state** — pure client state that multiple components observe and that needs to be readable _outside_ React's render lifecycle. **Redux** is built for exactly that.

The libraries don't overlap. They solve different problems, and the cost of running both is much less than the cost of forcing one to do the other's job.

## Why Cedarling

Authorization decisions in the UI are not hard-coded. Which menu items show, which buttons are enabled, which pages a user can open — all of it is decided by a Cedar policy store that ships with the build and runs in WASM in the browser. The user has the policies, the tokens, and the engine; the answer is a local decision.

This means changing who-can-do-what is a policy-store edit, not a UI change. See [cedarling.md](./cedarling.md) for the full story.

## Build pipeline at a glance

```text
source ──(Vite + Rolldown)──► dist/  ──► (Jenkins | Janssen installer) ──► browser
```

The same `dist/` artifact runs in every environment; environment-specific values are injected at runtime through `env-config.js`. See [build-deploy.md](./build-deploy.md) for chunking, bundle analysis, runtime env injection, and the two deployment paths.

## Where to read next

- [architecture.md](./architecture.md) — how the libraries fit together in the host / plugin model
- [config-api.md](./config-api.md) — the Orval + axios + React Query pipeline in detail
- [auth.md](./auth.md) — AppAuth, sessions, license verification
- [cedarling.md](./cedarling.md) — the Cedarling authorization layer
- [recipes.md](./recipes.md) — concrete patterns using these libraries together
