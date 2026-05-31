# Onboarding

First-day setup for a developer new to the Admin UI. ~15 min if your machine is ready; longer if you need to install Node or stand up a Jans Server.

The Admin UI is a pure client — it talks to the Jans Config API. You need a reachable Jans Server first (local Docker, remote dev host, or the [Docker quick-start](https://docs.gluu.org/stable/install/docker-install/quick-start)).

## Prerequisites

| Tool          | Version    | Notes                                                             |
| ------------- | ---------- | ----------------------------------------------------------------- |
| Node.js       | `24.x` LTS | Enforced by `engines` in `package.json`; `.nvmrc` shipped         |
| npm           | `10+`      | Bundled with Node 24                                              |
| Java          | `17+`      | Only if you also run a local Jans Server                          |
| A Jans Server | latest     | Local Docker, remote dev host, or the Docker quick-start (link ↑) |

`nvm use` in `admin-ui/` picks the right Node version automatically.

## Step 1 — Clone

```bash
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui
```

Everything you do happens under `admin-ui/`.

## Step 2 — Configure environment

Create `.env.development` in `admin-ui/`:

```dotenv
BASE_PATH=/admin/
CONFIG_API_BASE_URL=https://<jans-server-host>/jans-config-api
API_BASE_URL=https://<jans-server-host>/jans-config-api/admin-ui
NPM_TOKEN=
```

Replace `<jans-server-host>` with your Jans Server's hostname.

### Variables

| Variable              | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `BASE_PATH`           | URL path the app is served from (`/admin/`)               |
| `CONFIG_API_BASE_URL` | Jans Config API base URL                                  |
| `API_BASE_URL`        | Jans Admin UI API base URL (a Config API sub-path)        |
| `NPM_TOKEN`           | Unused — leave empty                                      |
| `ANALYZE`             | When `true`, the prod build emits the Sonda bundle report |

Vite loads `.env`, `.env.<mode>`, `.env.<mode>.local` (later wins). `.env.*.local` are for per-machine overrides — gitignored, never commit secrets. Full model in [build-deploy.md](./build-deploy.md#env-files-per-mode).

## Step 3 — Install + generate client

```bash
npm install
npm run api:orval
```

The second runs **Orval** — pulls upstream OpenAPI specs, merges, generates the typed client under `jans_config_api_orval/src/`. Every backend call goes through these hooks; without them, nothing compiles. Re-run when the upstream spec changes. See [config-api.md](./config-api.md#regenerating-the-client).

## Step 4 — Run the dev server

```bash
npm start
```

Default URL is `http://localhost:4100/admin/`. Open it and you'll be redirected to your Jans Server to sign in via OAuth + PKCE — see [auth.md](./auth.md#oauth--pkce-sign-in).

After sign-in, the sidebar shows whichever plugins your Cedarling role can read.

`/admin/env-config.js` is served in dev by an in-dev Vite plugin — no 404 expected. If you see one, restart `npm start` (Vite doesn't hot-reload `vite.config.ts`).

React Query DevTools button appears bottom-right in dev — click to inspect cache.

## Quality gates

- **Husky pre-commit hook** runs automatically on `git commit`: Prettier + ESLint + `tsc` + markdownlint on the staged subset. Fix, re-stage, commit again.
- **`npm run check:all`** runs the same checks across the repo. Use it if you skipped the hook.

No CI lint or test step — the hook is the only enforcement point. See [build-deploy.md](./build-deploy.md#ci--jenkins).

## Next steps

- [architecture.md](./architecture.md) — host + plugin split. The most important read for new developers.
- [conventions.md](./conventions.md) — naming, imports, types, styling, i18n, audit.
- [tech-stack.md](./tech-stack.md) — every library, one page.
- [recipes.md](./recipes.md) — adding a page, plugin, slice, etc.
- [cedarling.md](./cedarling.md) — permissions.
- [auth.md](./auth.md) — sign-in / session / license dance.

## If something doesn't work

- **"Cannot find module 'JansConfigApi'"** → you skipped `npm run api:orval`. Re-run it.
- **Sign-in loops back to login** → user lacks the `jansAdminUIRole` claim. See [auth.md](./auth.md#debugging-tips).
- **Sign-in succeeds, page blank** → license verification failed. Check network tab for `/license/...` and [auth.md](./auth.md#license-verification).
- **404 on `/admin/env-config.js`** → restart `npm start`.
- **Cedarling-gated pages render empty** → policy store didn't load. Check network for `fetchPolicyStore` and [cedarling.md](./cedarling.md).
