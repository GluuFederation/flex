# Gluu Admin UI

Reactive web interface for managing Janssen Auth Server configuration — clients, scopes, scripts, sessions, attributes, SAML/SCIM/FIDO/SMTP/Cache config, metrics.

## Quick start

```bash
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui

cat > .env.development <<'EOF'
BASE_PATH=/admin/
CONFIG_API_BASE_URL=https://<jans-server-host>/jans-config-api
API_BASE_URL=https://<jans-server-host>/jans-config-api/admin-ui
NPM_TOKEN=
EOF

npm install
npm run api:orval   # generate the typed Config API client
npm start           # http://localhost:4100/admin/
```

Prerequisites: Node `24.x`, npm `10+`, a reachable Jans Server. Full walkthrough in [docs/onboarding.md](./docs/onboarding.md).

## Documentation

| Doc                                      | Read when                                            |
| ---------------------------------------- | ---------------------------------------------------- |
| [Onboarding](./docs/onboarding.md)       | First time setting up                                |
| [Architecture](./docs/architecture.md)   | Host + plugins, dependency rules                     |
| [Tech stack](./docs/tech-stack.md)       | What each library is, when to use it                 |
| [Conventions](./docs/conventions.md)     | **Before opening any PR**                            |
| [Recipes](./docs/recipes.md)             | Adding a page / plugin / slice / form / audit record |
| [Auth](./docs/auth.md)                   | OIDC + PKCE, tokens, sessions, idle timeout, logout  |
| [Cedarling](./docs/cedarling.md)         | Adding or gating an authorization check              |
| [Config API](./docs/config-api.md)       | Calling the Janssen backend, regenerating the client |
| [Testing](./docs/testing.md)             | Jest setup, mocks, writing a new test                |
| [Build & deploy](./docs/build-deploy.md) | Bundle analysis, chunking, env injection, Jenkins    |

## npm scripts

| Command                           | What it does                                                                |
| --------------------------------- | --------------------------------------------------------------------------- |
| `npm start`                       | Vite dev server (alias for `start:dev`)                                     |
| `npm run start:dev`               | Vite dev server in `development` mode                                       |
| `npm run build:dev`               | Build with `development` mode (sourcemaps, dev env)                         |
| `npm run build:prod`              | Build with `production` mode (minified)                                     |
| `ANALYZE=true npm run build:prod` | Prod build + `dist/sonda-report.html` + `.json`                             |
| `npm run preview:prod`            | Build prod, patch runtime config, preview                                   |
| `npm run preview:prod:analyze`    | Full prod build + Sonda + knip + preview, prints report links               |
| `npm test`                        | Jest, watch-friendly                                                        |
| `npm run test:all`                | Jest single-pass, in-band, no watchman                                      |
| `npm run check:all`               | ESLint + markdownlint + `tsc` (parallel)                                    |
| `npm run format`                  | Prettier write (covers `.md` too)                                           |
| `npm run api:orval`               | Regenerate the Jans Config API TS client from the merged OpenAPI            |
| `npm run clean`                   | Wipe `dist/`, Vite cache, ESLint cache                                      |
| `npm run clean:all`               | Full wipe to fresh-clone state (node_modules, lock, Orval client, coverage) |
| `npm run reset`                   | `clean:all` → `npm install` → `npm run api:orval` — one-shot recovery       |
| `npm run clean:paths -- <path…>`  | Wipe specific paths                                                         |
| `npm run cache:terminal:clean`    | Clear npm cache + terminal                                                  |

## Pre-commit hook

Husky runs Prettier, ESLint, `tsc`, markdownlint on commit against staged `.js/.jsx/.ts/.tsx/.json/.css/.scss/.md`. Only `npm run format` auto-fixes (Prettier); other tools report — fix the cause yourself.

Don't bypass with `--no-verify`. Lint/type-check enforcement lives **only** in the hook — CI is artifact-build only (see [build-deploy.md](./docs/build-deploy.md#ci--jenkins)).

## Issues & contributing

- Bugs / requests: <https://github.com/GluuFederation/flex/issues>
- Read [conventions.md](./docs/conventions.md) before opening a PR.
- Commits must be GPG-signed (`git commit -S -s`).
