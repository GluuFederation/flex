# Build and deploy

## Introduction

The Admin UI is built by Vite into a single static `dist/` folder containing `index.html`, hashed JavaScript chunks, CSS, and image assets. The same `dist/` runs in every environment. A developer's laptop, a Jenkins-deployed test server, a customer's installer VM. Without re-building. Environment-specific values (mostly the Config API URL) are injected at runtime through a small `env-config.js` script the installer or dev server provides.

The production bundle is `npm run build:prod`. The output is `dist/`.

## Build modes

Vite supports two build modes in this project, each producing a different `dist/` shape. The mode is set by the `--mode` flag, which Vite uses to choose both the env file to load and the build optimizations to apply.

| Script               | Mode        | Notes                       |
| -------------------- | ----------- | --------------------------- |
| `npm run build:dev`  | development | Source maps, dev env values |
| `npm run build:prod` | production  | Minified, the real artifact |

Output is always `dist/`. `npm run clean` wipes `dist/`, the Vite cache, and the ESLint cache.

For local development you usually don't run `build:dev`: you run `npm start`, which boots the Vite dev server with HMR and serves files directly. `build:dev` exists for the rare case where you want a production-shaped artifact with dev env values (debugging a build issue, for example).

## Env files per mode

Vite loads environment values from `.env`, `.env.<mode>`, and `.env.<mode>.local` (later wins). Each build mode pairs with the matching `.env.<mode>`:

| Mode          | File               | Used by                                      |
| ------------- | ------------------ | -------------------------------------------- |
| `development` | `.env.development` | `npm start`, `npm run build:dev`             |
| `production`  | `.env.production`  | `npm run build:prod`, `npm run preview:prod` |

The mode is selected by Vite's `--mode <name>` flag, which the `build:*` npm scripts pass automatically.

The values from these files become available in the build as `process.env.<NAME>`. Vite rewrites these references statically at build time. See [Runtime env injection](#runtime-env-injection) below for how the Config API base URL reaches the running app. Full variable list in [onboarding.md](./onboarding.md#variables).

## Preview mode

After `npm run build:prod`, you can serve the resulting `dist/` over a local static server to sanity-check it before shipping. This is what `vite preview` does, and the npm scripts wrap it with a runtime-config patch so the preview behaves exactly like a deployed production artifact.

| Script                         | What it does                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `npm run preview:prod`         | `build:prod` → patch runtime config into `dist/` → `vite preview --host 0.0.0.0`                |
| `npm run preview:prod:analyze` | Same as `preview:prod` + Sonda + `knip --reporter json`. Prints `file://` links to both reports |

The "patch runtime config" step runs [`script/patch-dist-runtime-config.ts`](../script/patch-dist-runtime-config.ts) with the `production` argument. It writes a real `dist/env-config.js` populated from `.env.production` so the preview behaves exactly like a deployed prod artifact. No leftover `%(...)s` placeholders, no localhost fallbacks.

## Bundle analysis

Two tools inspect the output bundle. Both are opt-in. Running an ordinary `build:prod` does not invoke them.

- **Sonda**: produces a treemap of which packages contribute which bytes, plus a list of used and unused exports per module. Enabled by `ANALYZE=true npm run build:prod`. Emits `dist/sonda-report.html` (interactive treemap) and `dist/sonda-report.json` (machine-readable; the `.issues[]` array lists anything Sonda flagged as a potential problem, like duplicate package versions).
- **knip**: finds dead code: unused files, exports, and dependencies. Runs as part of `preview:prod:analyze` and writes its findings to `dist/knip-report.json`.

For a full analyze pass: `npm run preview:prod:analyze`. That builds prod with `ANALYZE=true`, patches the runtime config into `dist/`, runs `knip --reporter json`, prints `file://` links to both reports, and starts `vite preview` on `0.0.0.0` so you can browse the analyzed bundle interactively.

## Chunking

### Why it matters

The production bundle is split into chunks so the browser can cache vendor code separately from app code. Changing one component file shouldn't invalidate the entire React download. Chunking is configured declaratively in [`vite.config.ts`](../vite.config.ts) under `build.rolldownOptions.output.codeSplitting.groups`, with the `FEATURE_GROUPS` constant listing the package buckets.

### How groups work

Each group is a named bundle that pulls in a set of related `node_modules` packages. When a chunk imports from any package in a group, all the other packages in that group are pulled into the same chunk. The result is a fixed set of vendor chunks with predictable contents: `vendor-react` always contains React, `vendor-mui` always contains MUI, and so on.

Anything in `node_modules` that is not matched by an explicit group falls into a per-package `vendor-<pkg>` chunk by default. This keeps the unmatched libraries from being lumped into one giant "vendor" blob and helps each one update independently.

### Rules to follow

- **`vendor-react` must come first and stay runtime-only.** React must not be duplicated across chunks (see the warning below).
- **Group related packages together.** Put UI libraries (`@mui/*`, Emotion, tss-react) in one group. State libraries (Redux Toolkit, redux-persist) in another. Forms (Formik, Yup) in a third. Etc. Related packages tend to be loaded together by the same routes, so grouping them produces fewer requests.
- **The current group list lives in code, not docs.** Read `FEATURE_GROUPS` in [`vite.config.ts`](../vite.config.ts) for the authoritative version. This doc would drift if it duplicated the list.

> [!WARNING]
> **Don't use the `manualChunks` callback form** on Vite 8 / Rolldown. It duplicates React across chunks and produces React error #130 at runtime ("Element type is invalid"). Always use the declarative `build.rolldownOptions.output.codeSplitting.groups` form. `vendor-react` must come first in the groups list and stay runtime-only. We have hit this bug before. If a future PR proposes switching to a `manualChunks` callback for any reason, the answer is no.

## Runtime env injection

### Why it exists

The Admin UI ships a single `dist/` artifact that runs unchanged in every environment. The way one bundle works in many places is by deferring environment-specific values (most importantly the Config API URL) to a small script loaded before the app bundle. Without this, every environment would need its own build.

### How it works

`index.html` carries:

```html
<script src="/admin/env-config.js"></script>
```

This script's only job is to set `window.configApiBaseUrl` (and a few sibling globals) before the main React code reads them. Different environments provide different versions of this file.

| Environment           | Who provides `env-config.js`                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Janssen installer VMs | The installer (`flex_setup.py`) renders the real file next to `index.html`                             |
| Jenkins-deployed envs | Jenkins `sed`-substitutes `%(...)s` placeholders in `index.html` during deploy                         |
| Dev (Vite)            | No middleware serves `/admin/env-config.js`. The request 404s and the axios fallback chain takes over. |

Because the env values are not baked into the bundle, two installs of the same Admin UI version can point at different Config APIs without rebuilding. CDN caching also works correctly. The `dist/` content is identical across deployments, only `env-config.js` differs.

### Fallback chain at boot

If `env-config.js` is missing or empty, the axios instance in [`orval/axiosInstance.ts`](../orval/axiosInstance.ts) falls through a chain. See [config-api.md](./config-api.md#base-url-resolution) for the resolution order. A dev 404 on `/admin/env-config.js` is harmless thanks to that fallback. The base URL comes from `process.env.CONFIG_API_BASE_URL` (set in `.env.development`) instead.

## CI / Jenkins

The flex Jenkins pipeline is deliberately minimal. It does not run lint, type-check, or tests. Those are enforced at commit time by the husky pre-commit hook. CI is purely an artifact builder.

The pipeline:

1. **Regenerates `package-lock.json` from scratch.** This catches dependency-resolution issues that wouldn't appear locally.
2. **Builds the chosen mode** by running `npm run build:$ENV_NAME` (e.g. `build:prod`).
3. **Substitutes `%(...)s` placeholders** in `dist/index.html` via `sed` so the runtime env values are baked into the deployed `index.html`.
4. **Publishes `dist/`** to the target deployment.

The rule is simple: anything that must pass _before merge_ belongs in `.husky/pre-commit`. Anything that just produces the deployed artifact belongs in Jenkins. There is no "CI lint" step. That would be redundant with the pre-commit hook and slow down the artifact build.
