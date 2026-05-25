# Gluu Admin UI

Reactive web interface for managing Janssen Auth Server configuration — clients, scopes, scripts, sessions, attributes, SAML/SCIM/FIDO/SMTP/Cache config, and metrics.

## Quick start

```bash
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui

# .env.development  (point at your Jans Server)
cat > .env.development <<'EOF'
BASE_PATH=/admin/
CONFIG_API_BASE_URL=https://<jans-server-host>/jans-config-api
API_BASE_URL=https://<jans-server-host>/jans-config-api/admin-ui
NPM_TOKEN=
EOF

npm install
npm run api:orval   # generates the typed Config API client
npm start           # http://localhost:4100/admin/
```

Prerequisites: Node `24.x`, npm `10+`, a reachable Jans Server. Full walkthrough in [docs/onboarding.md](./docs/onboarding.md).

## Documentation

| Doc                                      | Read it when                                           |
| ---------------------------------------- | ------------------------------------------------------ |
| [Onboarding](./docs/onboarding.md)       | first time setting up                                  |
| [Architecture](./docs/architecture.md)   | understanding host + plugins, dependency rules         |
| [Tech stack](./docs/tech-stack.md)       | what each library is, where it's wired, when to use it |
| [Conventions](./docs/conventions.md)     | **before opening any PR**                              |
| [Recipes](./docs/recipes.md)             | adding a page / plugin / slice / form / audit record   |
| [Auth](./docs/auth.md)                   | OIDC + PKCE, tokens, sessions, idle timeout, logout    |
| [Cedarling](./docs/cedarling.md)         | adding/gating an authorization check                   |
| [Config API](./docs/config-api.md)       | calling the Janssen backend, regenerating the client   |
| [Testing](./docs/testing.md)             | Jest setup, mocks, writing a new test                  |
| [Build & deploy](./docs/build-deploy.md) | bundle analysis, chunking, env injection, Jenkins      |

## npm scripts

### Development

| Command                        | What it does                                                  |
| ------------------------------ | ------------------------------------------------------------- |
| `npm start`                    | start the Vite dev server (alias for `start:dev`)             |
| `npm run start:dev`            | Vite dev server in `development` mode                         |
| `npm run preview:prod`         | build prod, patch runtime config, preview                     |
| `npm run preview:prod:analyze` | full prod build + Sonda + knip + preview, prints report links |

### Build

| Command                           | What it does                                        |
| --------------------------------- | --------------------------------------------------- |
| `npm run build:dev`               | build with `development` mode (sourcemaps, dev env) |
| `npm run build:prod`              | build with `production` mode (minified)             |
| `ANALYZE=true npm run build:prod` | prod build + `dist/sonda-report.html` + `.json`     |

### Quality checks

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run check:all` | run ESLint + markdownlint + `tsc` together (parallel) |
| `npm run format`    | Prettier write (covers `.md` too)                     |

### Tests

| Command            | What it does                           |
| ------------------ | -------------------------------------- |
| `npm test`         | Jest, watch-friendly                   |
| `npm run test:all` | Jest single-pass, in-band, no watchman |

### API client

| Command             | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `npm run api:orval` | regenerate the Jans Config API TS client from the merged OpenAPI |

### Housekeeping

| Command                          | What it does                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run clean`                  | wipe `dist/`, Vite cache, ESLint cache                                                                           |
| `npm run clean:all`              | full wipe: `node_modules/`, `package-lock.json`, generated Orval client, coverage, npm cache — fresh-clone state |
| `npm run reset`                  | `clean:all` → `npm install` → `npm run api:orval` — the one-shot recovery when your install is broken            |
| `npm run clean:paths -- <path…>` | wipe specific paths                                                                                              |
| `npm run cache:terminal:clean`   | clear npm cache + the terminal                                                                                   |

## Pre-commit hook

Husky runs Prettier, ESLint, `tsc`, and markdownlint on commit (against staged `.js/.jsx/.ts/.tsx/.json/.css/.scss/.md` files). If it blocks, read the output and fix the issues. Only `npm run format` can auto-fix (Prettier); the other tools report — fix the cause yourself.

Don't bypass with `--no-verify`; fix the cause. Lint/type-check enforcement lives **only** in the pre-commit hook — CI is just a build step (see [build-deploy.md](./docs/build-deploy.md#ci--jenkins)).

## Issues & contributing

- Bugs / requests: <https://github.com/GluuFederation/flex/issues>
- Read [conventions.md](./docs/conventions.md) before opening a PR.
- Commits must be GPG-signed (`git commit -S -s`).
