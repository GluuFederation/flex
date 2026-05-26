# Onboarding

Get a working dev environment in under 15 minutes.

## Prerequisites

| Tool          | Version    | Notes                                                                                                                         |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Node.js       | `24.x` LTS | enforced by `engines`                                                                                                         |
| npm           | `10+`      | bundled with Node 24                                                                                                          |
| Java          | `17+`      | only if you also run a local Jans backend                                                                                     |
| A Jans Server | latest     | local Docker, a remote dev host, or the [Docker quick-start](https://docs.gluu.org/stable/install/docker-install/quick-start) |

The Admin UI is a _client_ — it needs a reachable Jans Config API to do anything useful.

## 1. Clone

```bash
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui
```

## 2. Configure environment

Create `.env.development` in `admin-ui/`:

```dotenv
BASE_PATH=/admin/
CONFIG_API_BASE_URL=https://<jans-server-host>/jans-config-api
API_BASE_URL=https://<jans-server-host>/jans-config-api/admin-ui
NPM_TOKEN=
```

### Variables

| Variable              | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `BASE_PATH`           | URL path the app is served from (`/admin/`)               |
| `CONFIG_API_BASE_URL` | Jans Config API base URL                                  |
| `API_BASE_URL`        | Jans Admin UI API base URL (a Config API sub-path)        |
| `NPM_TOKEN`           | unused — leave empty                                      |
| `ANALYZE`             | when `true`, the prod build emits the Sonda bundle report |

### Files per build mode

Vite loads `.env`, `.env.<mode>`, and `.env.<mode>.local` (in that order — later wins).

| Build mode (`--mode`)   | File loaded        | Driven by                                    |
| ----------------------- | ------------------ | -------------------------------------------- |
| `development` (default) | `.env.development` | `npm start`, `npm run build:dev`             |
| `production`            | `.env.production`  | `npm run build:prod`, `npm run preview:prod` |

`.env.*.local` files are for per-machine overrides — keep them out of git. Never commit secrets to any `.env*` file.

## 3. Install + generate the API client

```bash
npm install
npm run api:orval     # generates jans_config_api_orval/src from the OpenAPI
```

`api:orval` only needs to be re-run when the upstream OpenAPI changes.

## 4. Run the dev server

```bash
npm start
```

Open the URL Vite prints (default `http://localhost:4100/admin/`). You'll be redirected to your Jans Server to sign in.

## What you'll see in the console

`/admin/env-config.js` is served in dev by an in-dev Vite plugin — no 404 expected. If you see one, check [config-api.md](./config-api.md#runtime-env-injection).

## Next steps

- Read [architecture.md](./architecture.md) — host + plugins, how the pieces fit.
- Read [conventions.md](./conventions.md) before opening a PR.
- Add a new component or plugin: see [architecture.md](./architecture.md#adding-a-new-plugin).
