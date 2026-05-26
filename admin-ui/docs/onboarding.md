# Onboarding

## Introduction

This is the first-day setup guide for a developer new to the Admin UI. By the end of it you should have a working dev environment talking to a running Jans Server, with the dev server running locally and the app rendering in a browser. Plan for about fifteen minutes if your machine is set up; longer if you need to install Node or stand up a Jans Server.

The Admin UI is a pure client — it talks to the Jans Config API for everything. That means before you can do anything useful with the dev server, you need a Jans Server you can reach: a local Docker install, a remote dev host, or the [Docker quick-start](https://docs.gluu.org/stable/install/docker-install/quick-start). If you don't have one yet, set that up first.

This document covers prerequisites, environment configuration, install / API client generation, running the dev server, and where to read next. Each step is sequential — do them in order on a fresh clone.

## Prerequisites

Before you start, confirm you have these installed:

| Tool          | Version    | Notes                                                                                                                         |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Node.js       | `24.x` LTS | Enforced by `engines` in `package.json`; nvm/`.nvmrc` will pick the right version                                             |
| npm           | `10+`      | Bundled with Node 24                                                                                                          |
| Java          | `17+`      | Only if you also run a local Jans Server                                                                                      |
| A Jans Server | latest     | Local Docker, a remote dev host, or the [Docker quick-start](https://docs.gluu.org/stable/install/docker-install/quick-start) |

If you are using `nvm`, the project ships an `.nvmrc` — running `nvm use` in `admin-ui/` will switch to the right Node version automatically.

## Step 1 — Clone the repo

```bash
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui
```

The Admin UI is a sub-folder of the wider `flex` monorepo. Everything you do as an Admin UI developer happens under `admin-ui/` — see [conventions.md](./conventions.md) for the scope.

## Step 2 — Configure environment

The Admin UI reads several environment variables at build time to know which Jans Server to talk to and which URL prefix to mount under. These live in `.env` files that Vite loads automatically.

Create `.env.development` in `admin-ui/`:

```dotenv
BASE_PATH=/admin/
CONFIG_API_BASE_URL=https://<jans-server-host>/jans-config-api
API_BASE_URL=https://<jans-server-host>/jans-config-api/admin-ui
NPM_TOKEN=
```

Replace `<jans-server-host>` with the hostname of the Jans Server you're targeting.

### What each variable does

Each variable controls one specific piece of how the app is served and where it points. Two are required (`CONFIG_API_BASE_URL`, `API_BASE_URL`), `BASE_PATH` has a sensible default, and the last two can usually be left alone in day-to-day development.

| Variable              | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `BASE_PATH`           | URL path the app is served from (`/admin/`)               |
| `CONFIG_API_BASE_URL` | Jans Config API base URL                                  |
| `API_BASE_URL`        | Jans Admin UI API base URL (a Config API sub-path)        |
| `NPM_TOKEN`           | Unused — leave empty                                      |
| `ANALYZE`             | When `true`, the prod build emits the Sonda bundle report |

### How Vite loads env files

Vite loads `.env`, `.env.<mode>`, and `.env.<mode>.local` in that order — later files win. Which `<mode>` is used depends on the command you're running:

| Build mode (`--mode`)   | File loaded        | Driven by                                    |
| ----------------------- | ------------------ | -------------------------------------------- |
| `development` (default) | `.env.development` | `npm start`, `npm run build:dev`             |
| `production`            | `.env.production`  | `npm run build:prod`, `npm run preview:prod` |

`.env.*.local` files are for per-machine overrides — they are gitignored and you should keep them that way. **Never commit secrets to any `.env*` file.** See [build-deploy.md](./build-deploy.md#environment-files-per-mode) for the full env-handling model and how runtime injection lets one bundle work in multiple environments.

## Step 3 — Install dependencies and generate the API client

Run two commands in order:

```bash
npm install
npm run api:orval
```

The first installs Node dependencies. The second runs the **Orval** code generator — it pulls the latest Jans OpenAPI specs, merges them, and generates a typed TypeScript client under `jans_config_api_orval/src/`. Every backend call in the Admin UI goes through these generated hooks; without them, nothing compiles. See [config-api.md](./config-api.md#regenerating-the-client) for what the script actually does.

You only need to re-run `npm run api:orval` when the upstream OpenAPI spec changes — typically when you pull new commits that touch the Jans Server API. For local feature work, the generated client stays stable.

## Step 4 — Run the dev server

```bash
npm start
```

Vite boots, applies the env-config plugin, and prints the URL it's serving on (default `http://localhost:4100/admin/`). Open that URL in your browser and you'll be redirected to your Jans Server to sign in via OAuth + PKCE — see [auth.md](./auth.md#oauth--pkce-sign-in) for the full sign-in flow.

After successful sign-in, you'll land on the Dashboard. From there, the sidebar shows whichever plugins your Cedarling role has read access to.

### What you'll see in the dev console

`/admin/env-config.js` is served in dev by an in-dev Vite plugin — no 404 is expected. If you see one, the plugin isn't running — restart the dev server (Vite does not hot-reload `vite.config.ts`). See [config-api.md](./config-api.md#runtime-env-injection) for what `env-config.js` actually does.

The React Query DevTools button appears in the bottom-right corner in dev — click it to inspect cache state and pending queries.

## Quality gates

Before opening a PR, two things should pass:

- **Husky pre-commit hook** — runs automatically on `git commit`. It runs Prettier, ESLint, `tsc`, and markdownlint on the staged subset of files. If it fails, fix the issue, re-stage, and commit again.
- **`npm run check:all`** — runs the same lint + type-check + markdown-lint stack against the whole repo. Run this if you skipped the pre-commit hook for any reason.

There is no CI lint or test step — the pre-commit hook is the only enforcement point in the merge path. CI is purely an artifact builder. See [build-deploy.md](./build-deploy.md#ci--jenkins) for details.

## Next steps

You have a working dev environment. From here:

- Read [architecture.md](./architecture.md) — the host + plugin split and how the pieces fit together. The single most important read for new developers.
- Read [conventions.md](./conventions.md) before opening a PR. The lint will catch most violations but understanding _why_ the rules exist makes the codebase easier to work in.
- Skim [tech-stack.md](./tech-stack.md) — one page, every library, what each one is for.
- Want to add a new page or plugin? Start at [recipes.md](./recipes.md), specifically [Add a new page](./recipes.md#add-a-new-page-inside-an-existing-plugin) or [Add a new plugin](./recipes.md#add-a-new-plugin).
- Want to understand permissions? [cedarling.md](./cedarling.md) explains how the Admin UI decides which UI you can see.
- Want to understand the sign-in / session / license dance at startup? [auth.md](./auth.md) walks through it with sequence diagrams.

## If something doesn't work

A few common first-day issues:

- **"Cannot find module 'JansConfigApi'"** — you skipped `npm run api:orval`, or it failed. Re-run it and look at the output.
- **Sign-in loops back to the login page** — the user account on the Jans Server probably doesn't have the `jansAdminUIRole` claim. See [auth.md](./auth.md#debugging-tips).
- **Sign-in succeeds but the page is blank or stuck loading** — license verification failed. Check the network tab for failed calls to `/license/...` endpoints and see [auth.md](./auth.md#license-verification).
- **404 on `/admin/env-config.js`** — the dev `admin-ui:env-config` plugin isn't running; restart `npm start`.
- **Cedarling-gated pages render empty** — the policy store didn't load. Check the network tab for `fetchPolicyStore`, the dev console for `cedarlingClient.initialize` errors, and see [cedarling.md](./cedarling.md).
