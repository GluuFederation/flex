# Authentication

OAuth 2.0 / OpenID Connect with **PKCE**. The flow is driven by `@openid/appauth` (AppAuth-JS) — the UI never sees a client secret. Authorization decisions (UI gating) are separate: see [cedarling.md](./cedarling.md).

## Pieces

| Concern                            | File                                                 |
| ---------------------------------- | ---------------------------------------------------- |
| OIDC provider + flow orchestration | `app/utils/AppAuthProvider.tsx`                      |
| Token + issuer storage helpers     | `app/utils/TokenController.ts`                       |
| Logout / end-session URL builder   | `app/utils/urlSecurity.ts`                           |
| Redux state (config, tokens, user) | `app/redux/features/authSlice.ts`                    |
| Async auth flow (sagas)            | `app/redux/sagas/AuthSaga.ts`                        |
| Idle-timeout UI                    | `app/routes/Apps/Gluu/GluuSessionTimeout.tsx`        |
| Forced-logout helper               | `redirectToLogout` in `app/redux/sagas/SagaUtils.ts` |

## High-level flow

```text
                 ┌───────────────────────────────────────────┐
                 │   user visits /admin/ (no session)        │
                 └────────────────────┬──────────────────────┘
                                      │
                AppAuthProvider builds AuthorizationRequest
                (PKCE code_challenge, scope, state, nonce)
                                      │
                       ▼ redirects to Jans Auth Server
                 ┌───────────────────────────────────────────┐
                 │   user authenticates on Jans              │
                 └────────────────────┬──────────────────────┘
                                      │   (callback with `code`)
                                      ▼
              AppAuthProvider exchanges code → tokens via
              TokenRequest (grant_type=authorization_code,
              code_verifier supplied — no client secret)
                                      │
                                      ▼
                 token in memory + saved per spec;
                 userinfo decoded (jwt-decode) → authSlice
                                      │
                                      ▼
                 AuthSaga calls fetchApiTokenWithDefaultScopes
                 (gets the Config-API-scoped access token)
                                      │
                                      ▼
                 Orval-generated hooks become callable
                 with `setApiToken(...)` already wired
```

## Tokens

- **OIDC `id_token`** — decoded by `jwt-decode` to populate `userinfo`. Stored in Redux (`authReducer.userinfo`), persisted via `redux-persist`.
- **`access_token` (UI scopes)** — held by AppAuth's `LocalStorageBackend` for the UI's own use against the issuer.
- **Config API access token** — fetched separately via `fetchApiTokenWithDefaultScopes` in `AuthSaga`, then handed to Orval via `setApiToken(...)`. Every Orval hook uses this token, not the OIDC one.

Never reach into `localStorage` directly for tokens — go through `TokenController` / AuthSaga.

## Storage keys

Storage keys cover **five separate concerns**, not just language. `app/constants/storageKeys.ts` is the single source of truth:

| Key                        | Feature                                                          | Set by                                          | Read by                                                               |
| -------------------------- | ---------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| `USER_CONFIG`              | User prefs blob (theme + language saved together)                | `LanguageMenu`, `ThemeDropdown`                 | `i18n.ts`, `LanguageMenu`, `themeContext`                             |
| `INIT_THEME`               | UI theme (light/dark)                                            | `themeContext`, `logoutSlice` (reset on logout) | `themeContext`, `layout/default.tsx`                                  |
| `INIT_LANG`                | UI language                                                      | `LanguageMenu`, `logoutSlice` (reset on logout) | `i18n.ts`, `LanguageMenu`                                             |
| `USER_INFO`                | Decoded OIDC `userinfo` cache (for theme/lang restore on reload) | `AppAuthProvider` on sign-in                    | `themeContext` (to pick the user's saved theme)                       |
| `ISSUER`                   | OIDC issuer URL                                                  | `TokenController.saveIssuer` after discovery    | `TokenController.getIssuer` on subsequent boots                       |
| `POST_LOGOUT_REDIRECT_URI` | Where to send the user after end-session                         | `AuthSaga` from the OAuth2 config               | `ByeBye.tsx` as a fallback if the OIDC end-session URL can't be built |

Add to this file before writing anything new to `localStorage`. Inline string keys are a lint regression.

The keys are deliberately spread across `localStorage` (cross-tab, survives reload) rather than Redux because most of them must be readable **before** React/Redux boots (theme + language must apply on the very first paint to avoid a flash).

## 401 vs 403

- **401 (unauthorized)** — handled by AppAuth: refresh / re-auth as a normal token lifecycle event.
- **403 (forbidden)** — distinct path. `isFourZeroThreeError(err)` in `TokenController.ts` distinguishes it. A 403 generally means Cedarling denied (auth is fine, permission isn't); the UI surfaces a permission error rather than logging the user out.

When you write a new mutation, surface 403 separately — don't collapse it into "session expired."

## Idle timeout

`GluuSessionTimeout` wraps the app via `react-idle-timer`. Default 5 minutes idle → 10-second countdown modal → forced logout. Configurable per environment (`sessionTimeoutInMins` from the auth slice).

When the modal countdown expires, `auditLogoutLogs` is dispatched (so the logout is auditable) before navigation away.

## Logout

There are two trigger paths but they converge on the same cleanup. The page `app/routes/Pages/ByeBye.tsx` is the central exit point — both the user-clicked logout and the idle-timeout flow land there.

### Trigger paths

1. **User-initiated** — Sidebar/menu logout link routes to `/logout` → `ByeBye.tsx`.
2. **Forced (saga side)** — `redirectToLogout(message)` in `app/redux/sagas/SagaUtils.ts`. Called when a saga hits a fatal auth error (e.g. 403 on a session-creating call). Best-effort cleanup, then `window.location.href = '/admin/logout'` — same destination.
3. **Idle timeout** — `GluuSessionTimeout` dispatches `auditLogoutLogs` (so the involuntary logout is auditable) and then navigates to `/logout`.

### What `ByeBye.tsx` does, in order

1. `dispatch(setAuthState({ state: false }))` — flips the auth flag immediately so guarded UI hides.
2. If `state.authReducer.hasSession` is `true`, calls `deleteAdminUiSession()` against `ENDPOINTS.SESSION` (DELETE) to tell the backend to invalidate the admin-UI session cookie. Failures are logged but do not block the rest of logout.
3. `dispatch(logoutUser())` — the `logoutSlice` reducer wipes `localStorage` of tokens / userinfo, **preserves** `USER_CONFIG`, and resets `INIT_THEME` + `INIT_LANG` to defaults so the next visitor lands on a clean theme.
4. If the OAuth config has an `endSessionEndpoint`, builds the end-session URL with `buildSafeLogoutUrl(endSessionEndpoint, postLogoutRedirectUri, state)` and redirects there. Jans clears its own session and returns the browser to the redirect URI.
5. **Fallback** — if no `endSessionEndpoint` is available, redirects to the URL in `STORAGE_KEYS.POST_LOGOUT_REDIRECT_URI` (validated via `buildSafeNavigationUrl`), or `/` as a last resort.

`buildSafeLogoutUrl` and `buildSafeNavigationUrl` exist because hand-building those URLs is easy to get wrong (URL injection via a crafted `post_logout_redirect_uri`). Always go through them.

## Admin-UI session

OIDC sign-in is _not_ enough to talk to the Config API. The UI also needs a server-side **admin-UI session** that the Config API can correlate with the OIDC identity. This is what `createAdminUiSession` exists for.

### How it's created

1. After token exchange, `AuthSaga.getApiTokenWithDefaultScopes` calls `fetchApiTokenWithDefaultScopes` and receives `{ access_token, scopes, issuer, postLogoutRedirectUri }`.
2. `setApiToken(access_token)` is called on the Orval client so subsequent generated hooks send it as `Authorization: Bearer …`.
3. `AuthSaga` saves `STORAGE_KEYS.POST_LOGOUT_REDIRECT_URI` from that response (used later by `ByeBye.tsx` as a fallback).
4. `AuthSaga` dispatches `createAdminUiSession({ ujwt, apiProtectionToken })`, which calls the helper in `app/redux/api/backend-api.ts`:

   ```ts
   await axios.post(
     ENDPOINTS.SESSION,
     { ujwt },
     { headers: { Authorization: `Bearer ${apiProtectionToken}` }, withCredentials: true },
   )
   ```

   The `withCredentials: true` is what makes the browser accept and re-send the resulting `Set-Cookie` for subsequent Config API calls. The `ujwt` is the user JWT (proof of who the user is); `apiProtectionToken` is the short-lived token that protects the session-creation endpoint itself.

5. On success, `state.authReducer.hasSession` flips to `true` and the rest of the app can call the Config API. A 403 here means the user has no admin role — the saga calls `redirectToLogout()`.

### How subsequent Config API calls flow

Every Orval-generated hook ultimately calls through the shared axios instance (`app/redux/api/axios.ts`) configured with:

- `Authorization: Bearer <access_token>` (set via `setApiToken`, refreshed by `AuthSaga` when tokens roll)
- `withCredentials: true` so the admin-UI session cookie travels alongside

The Config API validates both: the bearer token authenticates the request, the cookie identifies the admin-UI session, and Cedarling (running embedded in the UI — see below) gates _which_ pages and actions are visible.

On logout, `deleteAdminUiSession()` (`DELETE ENDPOINTS.SESSION`) tears that cookie down server-side; `setApiToken('')` is implied by the next sign-in.

## License verification

The flow lives in `app/redux/sagas/LicenseSaga.ts` and the `licenseSlice`. It runs **after** OIDC sign-in and **before** unrestricted use of the app — a missing or invalid license puts the app into a license-screen state.

### What kicks it off

`AppAuthProvider` runs the two checks **sequentially**, not in parallel:

1. **On mount** — `dispatch(checkLicenseConfigValid(undefined))`. This always fires (with or without a callback `code`/`state` in the URL) and is guarded by a `hasDispatchedConfigCheck` ref so it only runs once.
2. **Once `state.licenseReducer.isConfigValid === true`** — a second `useEffect` reacts and dispatches `checkLicensePresent(undefined)`. If `isConfigValid` never flips, `checkLicensePresent` is never called — the UI stays on the license-error screen.

So the order is: config check → (only if valid) → presence check → (if present and not active) → retrieve/activate flow.

### What `checkLicensePresentWorker` does, in order

1. **`setupApiToken()`** — calls `fetchApiTokenWithDefaultScopes`, stores it in `licenseSlice` via `setApiDefaultToken`, and calls `setApiToken(...)` on Orval so the rest of the Orval hooks in this saga can run.
2. **`isLicenseActive()`** (Orval hook). If `success: true`, the response carries a list of license fields — the saga maps them into the slice (`isLicenseValid: true`, threshold info, expiry, etc.).
3. **If not active**, falls through `retrieveLicenseKey()`:
   - `retrieveLicense()` → if there's a stored key on the server, try to activate it via `activateAdminuiLicense()`.
   - On success, `checkUserLicenseKeyResponse({ success: true })`.
   - On no-key-found, `isNoValidLicenseKeyFound: true` — the UI shows the trial / SSA-upload screen.
4. **Threshold check** — `checkThresholdLimit` is dispatched to compare current MAU against the licensed cap (`getStat` Orval hook). If over, `isUnderThresholdLimit: false` and the UI shows a warning banner.
5. **Trial / manual activation** — `generateTrialLicense` and `uploadNewSsaToken` flows are also wired into the same saga. They mutate `licenseSlice` (`generatingTrialKey`, `errorSSA`) and re-run `checkLicensePresent` on success.

### Error / network handling

Every Orval call in `LicenseSaga` is wrapped to capture failures via `getBackendStatusFromError`. The status code + error message are mirrored into `state.authReducer.backendStatus` so the global `GluuServiceDownModal` can render if the Config API is unreachable. A 403 on the license endpoints again routes through `redirectToLogout()`.

### Which slice fields the UI reads

- `isLicenseValid` — gate for normal app rendering.
- `islicenseCheckResultLoaded` — distinguishes "still loading" from "loaded and invalid."
- `isNoValidLicenseKeyFound`, `error`, `errorSSA` — drive the license screen sub-states.
- `isConfigValid` — separate flag for the `checkLicenseConfigValid` call (independent of `checkLicensePresent`).
- `isUnderThresholdLimit` — drives the MAU warning.
- `isValidatingFlow`, `generatingTrialKey`, `isLoading` — UI spinners on the license screens.

If the license check fails with a network error, the user lands on the license-error screen — they can retry, paste an SSA token, or generate a trial key. None of these flows touch tokens; they only touch `licenseSlice` and the underlying Config API endpoints.

## Cedarling access control (recap)

Even when OIDC + license + session are all good, Cedarling gates **which** UI a given user sees. Full details in [cedarling.md](./cedarling.md). The short version:

- `useCedarling()` reads the user's tokens (id_token, access_token, userinfo) from `authReducer`.
- For each `(resourceId, action)` it asks `cedarlingClient.token_authorize(request)` — the policy engine runs **in the browser** as WASM, against the policy store bundled into the build (`policy-store-{dev,prod}.json`).
- Decisions are cached in `cedarPermissionsSlice` keyed by `buildCedarPermissionKey(resourceId, action)`. `hasCedarReadPermission` / `hasCedarWritePermission` / `hasCedarDeletePermission` read from that cache; `authorizeHelper(scopes)` dedupes and evaluates a batch (used in `useEffect` on page mount).
- Page render and individual buttons gate on these booleans. The Config API double-checks at the endpoint level — Cedarling is an **early gate**, not the only gate.

## OAuth scopes

The UI scopes (what the OIDC flow asks for) and the Cedarling resource scopes (what the policy store grants per page) are **separate concerns**:

- OIDC scopes → declared in the auth config the Jans Server hands back; AppAuth requests them in the `AuthorizationRequest`.
- Cedarling resource scopes → declared in `app/cedarling/constants/resourceScopes.ts` and evaluated at the page boundary via `useCedarling()`.

A user can be signed in (OIDC valid) but not authorized (Cedarling denies) — that's the normal case for role-restricted pages.

## Debugging tips

- AppAuth has a verbose log flag — at the top of `AppAuthProvider.tsx`: `setFlag('IS_LOG', true)` to trace flows locally. Don't ship `true`.
- `redux-devtools` shows the full `authReducer` slice, including tokens — useful for diagnosing "wrong token sent" issues.
- If the Config API rejects with `invalid_token`, check that `setApiToken` ran (visible in the AuthSaga) and that the token isn't the OIDC token by mistake.
