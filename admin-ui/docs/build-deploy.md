# Build & Deploy

## Modes

| Script                      | Mode        | Notes                       |
| --------------------------- | ----------- | --------------------------- |
| `npm run build:dev`         | development | source maps, dev env        |
| `npm run build:prod`        | production  | minified, the real artifact |
| `npm run build:adminuitest` | adminuitest | the test environment        |

Output is always `dist/`. `npm run clean` wipes `dist/`, the Vite cache, and the ESLint cache.

## Environment files per mode

Vite loads `.env`, `.env.<mode>`, and `.env.<mode>.local` (later wins). Each build mode pairs with the matching `.env.<mode>`:

| `--mode`      | File               | Used by                                      |
| ------------- | ------------------ | -------------------------------------------- |
| `development` | `.env.development` | `npm start`, `npm run build:dev`             |
| `production`  | `.env.production`  | `npm run build:prod`, `npm run preview:prod` |
| `adminuitest` | `.env.adminuitest` | `npm run build:adminuitest`                  |

See [onboarding.md](./onboarding.md#variables) for what each variable does.

## Preview mode

`vite preview` serves the built `dist/` over a local static server — useful for sanity-checking the production bundle end-to-end before shipping.

| Script                         | What it does                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `npm run preview`              | preview whatever is currently in `dist/` (no rebuild)                                           |
| `npm run preview:prod`         | `build:prod` → patch runtime config into `dist/` → `vite preview --host 0.0.0.0`                |
| `npm run preview:prod:analyze` | same as `preview:prod` + Sonda + `knip --reporter json`; prints `file://` links to both reports |

The "patch runtime config" step (`script/patch-dist-runtime-config.ts production`) writes a real `dist/env-config.js` populated from `.env.production` so the preview behaves exactly like a deployed prod artifact — no leftover `%(...)s` placeholders, no localhost fallbacks.

## Bundle analysis (Sonda)

```bash
ANALYZE=true npm run build:prod
```

Generates:

- `dist/sonda-report.html` — treemap, used/unused exports, duplicates
- `dist/sonda-report.json` — same data, programmatic; `.issues` array lists anything Sonda flagged

A fully wired analyze + knip + preview run:

```bash
npm run preview:prod:analyze
```

That builds prod (with `ANALYZE=true`), patches the runtime config into `dist/`, runs `knip --reporter json`, prints links to both reports, then starts `vite preview` on `0.0.0.0`.

## Chunking

Configured declaratively in `vite.config.ts` (`output.codeSplitting.groups`, with `FEATURE_GROUPS` listing the package buckets). Each group bundles a set of related packages into one chunk so cache hits stay stable across releases.

The rules:

- **`vendor-react` must come first and stay runtime-only** — React must not be duplicated across chunks (see warning below).
- Group related packages together: UI libraries, state libraries, forms, charts, editors, etc.
- Anything in `node_modules` not matched by an explicit group falls into a per-package `vendor-<pkg>` chunk.

For the current list of groups and what each contains, read `FEATURE_GROUPS` in `vite.config.ts` — that's the single source of truth.

### ⚠️ Do not use the `manualChunks` function form

Vite 8 / Rolldown — using a `manualChunks` callback duplicates React across chunks and produces React error #130 at runtime. Always use the declarative `output.codeSplitting.groups` form. `vendor-react` must come first and stay runtime-only.

## Runtime env injection

`index.html` carries:

```html
<script src="/admin/env-config.js"></script>
```

It runs _before_ the app bundle and sets `window.configApiBaseUrl` (and similar). One bundle, many environments.

| Environment           | Who provides `env-config.js`                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Janssen installer VMs | the installer (`flex_setup.py`) renders the real file next to `index.html`                                         |
| Jenkins-deployed envs | Jenkins `sed`-substitutes `%(...)s` placeholders in `index.html` during deploy                                     |
| Dev (Vite)            | the `admin-ui:env-config` plugin serves it via `configureServer` from `.env.development` values, or an empty no-op |

`app/redux/api/axios.ts` falls through: `window.configApiBaseUrl` → `process.env.CONFIG_API_BASE_URL` → `http://localhost:8080`. A dev 404 on `env-config.js` is harmless thanks to that fallback, but the plugin keeps the console clean.

## CI / Jenkins

The flex Jenkins pipeline runs **only** `npm run build:$ENV_NAME` (no preview, no lint, no tests — those run pre-commit). It:

1. Regenerates `package-lock.json` from scratch
2. Builds the chosen mode
3. `sed`-substitutes `%(...)s` placeholders in `dist/index.html`
4. Publishes `dist/`

Anything that needs to pass before merge belongs in the **husky pre-commit hook**, not in CI. CI is purely an artifact builder.

## Plugin management

| Script                  | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `npm run plugin:add`    | scaffold a new plugin and register it with the loader |
| `npm run plugin:remove` | unregister and delete a plugin                        |

These touch `plugins/PluginMenuResolver.ts`, `plugins/PluginReducersResolver.ts`, and `plugins/PluginSagasResolver.ts` — runtime-sensitive files. Use the scripts; don't hand-edit.
