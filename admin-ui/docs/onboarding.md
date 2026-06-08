# Onboarding

The Admin UI is a pure client. It talks to the Jans Config API. You need a reachable Jans Server first.

## Prerequisites

| Tool          | Version    | Notes                                                      |
| ------------- | ---------- | ---------------------------------------------------------- |
| Node.js       | `24.x` LTS | Enforced by `engines` in `package.json` (`.nvmrc` shipped) |
| npm           | `10+`      | Bundled with Node 24                                       |
| Java          | `17+`      | Only if you also run a local Jans Server                   |
| A Jans Server | latest     | See [Jans Server install](#jans-server-install) below      |

`nvm use` in `admin-ui/` picks the right Node version automatically.

## Jans Server install

Multiple install paths. Pick whichever fits:

- [Docker quick-start](https://docs.gluu.org/stable/install/docker-install/quick-start): fastest local setup
- [VM install](https://docs.gluu.org/stable/install/vm-install/vm-requirements/): bare-metal or VM with the Linux setup script
- A remote dev host already provisioned by the team

Whichever you pick, note its hostname. You'll point the Admin UI at it in [Step 2](#step-2-configure-environment).

## Step 1: Clone

```bash
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui
```

Everything you do happens under `admin-ui/`.

## Step 2: Configure environment

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
| `NPM_TOKEN`           | Unused (leave empty)                                      |
| `ANALYZE`             | When `true`, the prod build emits the Sonda bundle report |

Vite loads `.env`, `.env.<mode>`, `.env.<mode>.local` (later wins). `.env.*.local` are for per-machine overrides. Gitignored, never commit secrets. Full model in [build-deploy.md](./build-deploy.md#env-files-per-mode).

## Step 3: Install + generate client

```bash
npm install
npm run api:orval
```

The second runs **Orval**: pulls upstream OpenAPI specs, merges, generates the typed client under `jans_config_api_orval/src/`. Every backend call goes through these hooks. Without them, nothing compiles. Re-run when the upstream spec changes. See [config-api.md](./config-api.md#regenerating-the-client).

## Step 4: Run the dev server

```bash
npm start
```

Default URL is `http://localhost:4100/admin/`. Open it and you'll be redirected to your Jans Server to sign in via OAuth + PKCE. See [auth.md](./auth.md#oauth--pkce-sign-in).

After sign-in, the sidebar shows whichever plugins your Cedarling role can read.

In dev, nothing serves `/admin/env-config.js`, so a 404 for it is expected and harmless: the axios base-URL fallback chain takes over. See [build-deploy.md](./build-deploy.md).

React Query DevTools button appears bottom-right in dev. Click to inspect cache.

## Quality gates

- **Husky pre-commit hook** runs automatically on `git commit`: Prettier + ESLint + `tsc` + markdownlint on the staged subset. Fix, re-stage, commit again.
- **`npm run check:all`** runs the same checks across the repo. Use it if you skipped the hook.

No CI lint or test step. The hook is the only enforcement point. See [build-deploy.md](./build-deploy.md#ci--jenkins).

## Next steps

- [architecture.md](./architecture.md): host + plugin split. The most important read for new developers.
- [tech-stack.md](./tech-stack.md): every library, one page.
- [conventions.md](./conventions.md): naming, imports, types, styling, i18n, audit.
- [auth.md](./auth.md): sign-in, session, license dance.
- [cedarling.md](./cedarling.md): permissions and policy gating.
- [config-api.md](./config-api.md): how Orval + React Query talk to the Jans Config API.
- [recipes.md](./recipes.md): adding a page, plugin, slice, etc.
- [build-deploy.md](./build-deploy.md): Vite build, env injection, Jenkins, Husky.
- [testing.md](./testing.md): Jest unit tests, Playwright e2e.

## If something doesn't work

- **"Cannot find module 'JansConfigApi'"** → you skipped `npm run api:orval`. Re-run it.
- **Sign-in loops back to login** → user lacks the `jansAdminUIRole` claim. See [auth.md](./auth.md#debugging-tips).
- **Sign-in succeeds, page blank** → license verification failed. Check network tab for `/license/...` and [auth.md](./auth.md#license-verification).
- **404 on `/admin/env-config.js`** → expected in dev and harmless; the axios base-URL fallback handles it.
- **Cedarling-gated pages render empty** → policy store didn't load. Check network for `fetchPolicyStore` and [cedarling.md](./cedarling.md).
