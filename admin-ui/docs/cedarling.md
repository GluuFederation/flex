# Cedarling (Authorization)

Cedarling is the Jans-provided Cedar policy engine embedded in the Admin UI. It decides who can see and edit what — UI permissions are not hard-coded.

## How it gates access (end-to-end)

```text
component mounts
   │
   ▼
useCedarling() reads tokens (id_token, access_token, userinfo) from authReducer
   │
   ▼
authorizeHelper(scopes) is called once in a useEffect on the page
   │   ├── dedupes by (resourceId, actionLabel)
   │   ├── one Promise per unique pair
   │   ▼
   │   cedarlingClient.token_authorize(request)
   │   (WASM — no network call; the policy store is bundled into the build)
   │
   ▼
each decision is dispatched to cedarPermissionsSlice
   key = buildCedarPermissionKey(resourceId, action)
   value = isAuthorized | { isAuthorized, error }
   │
   ▼
hasCedarReadPermission(resourceId)   ──► cache[buildCedarPermissionKey(id, 'read')]
hasCedarWritePermission(resourceId)  ──► cache[buildCedarPermissionKey(id, 'write')]
hasCedarDeletePermission(resourceId) ──► cache[buildCedarPermissionKey(id, 'delete')]
   │
   ▼
component renders / hides UI based on the booleans
```

The action label is derived from the URL/permission string:

- `…/write` or any URL in the `executeUrls` set (`SSA_ADMIN`, `SSA_DEVELOPER`, `SCIM_BULK`, `REVOKE_SESSION`, `OPENID`) → `write`
- `…/delete` → `delete`
- anything else → `read`

This means a permission check has **zero runtime cost** once cached: subsequent renders just read the Redux slice. The first evaluation on page mount goes through WASM, gets cached, and every later button/section on the same page reuses it.

A 403 from the Config API is still possible if the policy store and the backend disagree — Cedarling is the **early gate**, not the only gate. The backend always re-validates.

## Where it lives

```text
app/cedarling/
├── client/         # Cedarling client wrapper
├── config/         # policy stores (policy-store-dev.json, policy-store-prod.json)
├── constants/      # CEDARLING_CONSTANTS + resourceScopes map
├── enums/          # scope/permission enums
├── hooks/          # useCedarling()
├── types/          # AdminUiFeatureResource, etc.
└── utility/        # ADMIN_UI_RESOURCES, CEDARLING_BYPASS, helpers
```

## Typical usage

```ts
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()

// Replace YourFeature with the resource your page guards
// (e.g. ADMIN_UI_RESOURCES.Users, ADMIN_UI_RESOURCES.Scopes, …).
const RESOURCE_ID = ADMIN_UI_RESOURCES.YourFeature

const canRead = useMemo(() => hasCedarReadPermission(RESOURCE_ID), [hasCedarReadPermission])
const canWrite = useMemo(() => hasCedarWritePermission(RESOURCE_ID), [hasCedarWritePermission])
```

Gate UI elements on the booleans; call `authorizeHelper(SCOPES)` in a `useEffect` so the runtime evaluates the policy for the page's required scopes.

## Resource ids

All resources live in `app/cedarling/utility/` (re-exported via `@/cedarling/utility`). Reference them by import — never inline a resource id as a string.

## Policy store

Per-mode JSON files in `app/cedarling/config/`:

- `policy-store-dev.json` — loaded in development builds
- `policy-store-prod.json` — loaded in production builds

The right file is selected at build time by `vite.config.ts` and embedded into the bundle.

## Bypass (local development)

`CEDARLING_BYPASS` (in `app/cedarling/utility/`) returns `true` for every permission check when set. Use it sparingly while debugging — never ship code that hard-codes a bypass.

## Adding a permission check

1. If the resource is new, add it to `app/cedarling/constants/`.
2. If a policy is new, add it to **both** policy-store JSONs (dev and prod).
3. Use `useCedarling()` in the component; gate render and actions on the booleans.
4. Verify by signing in with two different roles.
