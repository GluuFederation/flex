# Talking to the Jans Config API

The Admin UI is a client of the **Jans Config API** (a Janssen project). Every backend call goes through this layer.

```text
React component
   │
   ▼ (Orval-generated hook)
@tanstack/react-query
   │
   ▼
axios  ──►  Jans Config API
```

## Where things live

| Concern                   | File                                                |
| ------------------------- | --------------------------------------------------- |
| axios instance + base URL | `app/redux/api/axios.ts`                            |
| Orval config              | `orval.config.ts`                                   |
| Generated client          | `jans_config_api_orval/src/` (do **not** edit)      |
| Path alias                | `JansConfigApi` → `jans_config_api_orval/src/index` |
| OpenAPI merge step        | `openapi-merge.json`                                |

## Generated hooks

Orval emits typed hooks following a consistent naming pattern, one set per OpenAPI operation:

| Pattern                     | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `useGet<Operation>`         | query hook (read)                                   |
| `usePut<Operation>` etc.    | mutation hook (`Put` / `Post` / `Delete` / `Patch`) |
| `getGet<Operation>QueryKey` | query-key helper (use for `invalidateQueries`)      |
| `type <Schema>`             | schema types from the OpenAPI definitions           |

Import them from the `JansConfigApi` alias:

```ts
import { useGet<Operation>, usePut<Operation>, getGet<Operation>QueryKey, type <Schema> } from 'JansConfigApi'
```

Never write a hand-rolled fetch for the Config API — regenerate.

## Regenerating the client

Run after the upstream OpenAPI changes:

```bash
npm run api:orval
```

That:

1. Cleans `jans_config_api_orval/`
2. Merges the OpenAPI fragments (`openapi-merge.json`)
3. Runs `orval --config ./orval.config.ts`
4. Fixes enum imports (`script/fix-orval-enums.ts`)
5. Generates the barrel (`script/gen-orval-barrel.ts`)
6. Verifies mutations are wired (`script/verify-orval-mutations.ts`)

## Base URL resolution

The axios instance (in `app/redux/api/`) resolves its base URL through a fallback chain:

1. **`window.configApiBaseUrl`** — set at runtime by `env-config.js` (production / installer). Ignored if it still looks like an un-substituted `%(...)s` placeholder.
2. **`process.env.CONFIG_API_BASE_URL`** — baked in from `.env.<mode>` at build time.
3. **A hardcoded localhost fallback** — last resort so the app loads even with nothing configured.

This is why one `dist/` bundle can run unchanged in dev, on a Jenkins env, and on an installer VM.

## Runtime env injection

`index.html` loads `<script src="/admin/env-config.js"></script>`. The file's job is to set `window.configApiBaseUrl` and friends at runtime — so the same `dist/` bundle works in any environment.

| Environment                        | Who provides `env-config.js`                                                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production (Janssen installer VMs) | the installer renders it next to `index.html`                                                                                                                                 |
| Jenkins-deployed flex envs         | also via the installer; `index.html`'s `%(...)s` placeholders are `sed`-substituted during deploy (see [build-deploy.md](./build-deploy.md))                                  |
| Dev (Vite)                         | the `admin-ui:env-config` plugin in `vite.config.ts` serves it via `configureServer` — populated from `CONFIG_API_BASE_URL` in `.env.development`, or an empty no-op if unset |

If you see a 404 on `/admin/env-config.js` in dev, the in-dev plugin isn't running — restart the dev server (Vite doesn't hot-reload `vite.config.ts`).

## Audit logging

Every write through the Config API should produce an audit record. The helpers live in `@/audit`:

- `useAuditContext()` / `getCurrentAuditContext()` — pulls `client_id`, `ip_address`, `userinfo` from the auth slice.
- `createSuccessAuditInit(context, options?)` — wraps the context into a payload tagged `status: 'success'`.
- Action constants from `@/audit/UserActionType` — `CREATE`, `UPDATE`, `DELETION`, `PATCH`, `FETCH`.
- Resource constants — host-wide ones live in `@/audit` (e.g. `API_USERS`, `API_LICENSE`); plugin-specific ones live in `Plugins/<self>/redux/audit/Resources` (e.g. auth-server exports `OIDC`, `SCOPE`, `SESSION`).

## React Query conventions

- Use the generated `getGetXxxQueryKey()` helpers — never hand-write query keys.
- Default cache times come from `@/utils/queryUtils` (`DEFAULT_STALE_TIME`, `DEFAULT_GC_TIME`).
- Invalidate after mutations: `queryClient.invalidateQueries({ queryKey: getGetXxxQueryKey() })`.
