# Authentication

## Introduction

Authentication answers one question: **who is the user sitting in front of the browser?** The Admin UI gets the answer by signing the user in to the **Jans Auth Server** using **OAuth 2.0 / OpenID Connect with PKCE**. The flow is driven by [`@openid/appauth`](https://www.npmjs.com/package/@openid/appauth) (AppAuth-JS) — the UI never sees a client secret.

Out of scope here:

- **What the user is allowed to do** — decided by Cedarling at the page boundary, see [cedarling.md](./cedarling.md).
- **The Config API call itself** — how the bearer token reaches outgoing requests is covered in [config-api.md](./config-api.md). This doc covers how the token is _obtained_.

## Where the code lives

- **OIDC sign-in** — [`app/utils/AppAuthProvider.tsx`](../app/utils/AppAuthProvider.tsx), [`app/utils/TokenController.ts`](../app/utils/TokenController.ts), [`app/utils/urlSecurity.ts`](../app/utils/urlSecurity.ts)
- **Auth state** — [`app/redux/features/authSlice.ts`](../app/redux/features/authSlice.ts), [`app/redux/sagas/AuthSaga.ts`](../app/redux/sagas/AuthSaga.ts)
- **License flow** — [`app/redux/features/licenseSlice.ts`](../app/redux/features/licenseSlice.ts), [`app/redux/sagas/LicenseSaga.ts`](../app/redux/sagas/LicenseSaga.ts)
- **Idle timeout** — [`app/routes/Apps/Gluu/GluuSessionTimeout.tsx`](../app/routes/Apps/Gluu/GluuSessionTimeout.tsx)
- **Logout** — [`app/routes/Pages/ByeBye.tsx`](../app/routes/Pages/ByeBye.tsx), [`app/redux/sagas/SagaUtils.ts`](../app/redux/sagas/SagaUtils.ts)
- **Storage keys (all)** — [`app/constants/storageKeys.ts`](../app/constants/storageKeys.ts) (single source of truth)

## OAuth / PKCE sign-in

### Flow diagram

```mermaid
sequenceDiagram
    autonumber
    participant Browser as Browser (Admin UI)
    participant Provider as AppAuthProvider
    participant Jans as Jans Auth Server
    participant Redux as authReducer

    Browser->>Provider: visit /admin/ (no session)
    Provider->>Provider: build AuthorizationRequest<br/>(code_challenge from PKCE verifier)
    Provider->>Jans: redirect → /authorize?code_challenge=…
    Jans-->>Browser: user authenticates on Jans
    Jans->>Provider: redirect back with ?code=…
    Provider->>Jans: POST /token (code + code_verifier)
    Jans-->>Provider: id_token, access_token, refresh_token
    Provider->>Provider: decode id_token → userinfo
    Provider->>Redux: setUserInfo + setTokens
    Provider->>Redux: dispatch checkLicenseConfigValid()
```

### Explanation of the flow

The browser opens the Admin UI at `/admin/`. [`app/utils/AppAuthProvider.tsx`](../app/utils/AppAuthProvider.tsx) mounts and checks whether a valid session already exists in [`authReducer`](../app/redux/features/authSlice.ts). If not, it begins an **OAuth Authorization Code flow with PKCE**.

**PKCE** replaces the client secret. The browser generates a random secret called a **code verifier**, hashes it into a **code challenge**, and sends only the challenge with the redirect to the auth server. The auth server stores the challenge against this login attempt. When the browser later exchanges its authorization code for tokens, it sends the original verifier — the server hashes it and compares to the stored challenge. This proves the same browser that started the login is finishing it, without the Admin UI ever needing to hold a client secret.

The browser is redirected to the Jans Auth Server's `/authorize` endpoint. The user signs in there. Jans redirects back to `http://<admin-ui-host>/?code=…&state=…` — note this lands at the **origin**, not under `/admin/`, because the redirect URI is registered without a path.

`AppAuthProvider` sees the `code` in the URL and exchanges it for tokens by POSTing to the auth server's `/token` endpoint with `grant_type=authorization_code`, the code, and the original code verifier. No client secret is involved.

The response carries three tokens: an `id_token` (proof of identity, signed JWT), an `access_token` (for the UI's own scopes), and a `refresh_token` (for renewing the access token later). `AppAuthProvider` decodes the `id_token` using `jwt-decode` to extract the user profile (`userinfo` — email, name, `jansAdminUIRole`, etc.), then dispatches the tokens and decoded userinfo into [`authSlice`](../app/redux/features/authSlice.ts).

Once the tokens are in Redux, the provider triggers the next phase by dispatching `checkLicenseConfigValid()`. The user is signed in to the auth server, but the Admin UI is not yet usable — the license must be verified, and a server-side Admin UI session must be created.

## Admin-UI session

### Why it exists

OIDC sign-in alone does **not** let the UI talk to the Config API. The Config API requires two things on every request:

- A **bearer access token** that proves the caller has the right scopes.
- A **session cookie** that proves the caller went through the Admin UI sign-in flow (rather than a script bypassing it).

The bearer token + cookie pair is what `createAdminUiSession` exists to set up.

### Flow diagram

```mermaid
sequenceDiagram
    autonumber
    participant Saga as AuthSaga
    participant API as Jans Config API
    participant Orval as Orval client

    Saga->>API: fetchApiTokenWithDefaultScopes()
    API-->>Saga: { access_token, scopes, issuer, postLogoutRedirectUri }
    Saga->>Orval: setApiToken(access_token)
    Saga->>API: POST /session { ujwt, apiProtectionToken } (withCredentials: true)
    API-->>Saga: Set-Cookie: admin-ui-session=…
    Saga->>Saga: createAdminUiSessionResponse(hasSession: true)
```

### Explanation of the flow

The flow is driven by [`app/redux/sagas/AuthSaga.ts`](../app/redux/sagas/AuthSaga.ts). After the OAuth/PKCE step writes the user info into Redux, `AppAuthProvider` dispatches `getAPIAccessToken`. The saga calls `fetchApiTokenWithDefaultScopes()`, which talks to the Config API and returns a short-lived `access_token` scoped for the Config API, plus side values (`issuer`, `postLogoutRedirectUri`, the requested scopes).

The saga hands the token to the Orval client by calling `setApiToken(access_token)`. From that moment on, every Orval-generated hook (`useGet*`, `usePut*`, etc.) automatically attaches `Authorization: Bearer <token>` to its requests (see [config-api.md](./config-api.md)). The saga also persists `POST_LOGOUT_REDIRECT_URI` to `localStorage` so that [`ByeBye.tsx`](../app/routes/Pages/ByeBye.tsx) can use it as a fallback at logout time.

Then comes the session creation. The saga dispatches `createAdminUiSession({ ujwt, apiProtectionToken })`:

- **`ujwt`** is the user JWT — proof of identity.
- **`apiProtectionToken`** is a separate short-lived token that protects the session-creation endpoint itself.

The helper in [`app/redux/api/backend-api.ts`](../app/redux/api/backend-api.ts) POSTs to `ENDPOINTS.SESSION` with `withCredentials: true`, which tells the browser to accept any `Set-Cookie` header in the response and to send it back on subsequent requests to the same origin.

The Config API creates a server-side session record, sets a cookie, and returns success. The saga dispatches `createAdminUiSessionResponse({ hasSession: true })`, and `state.authReducer.hasSession` flips to `true` — unblocking the rest of the app.

If `createAdminUiSession` returns 403, that means the user signed in successfully but does not have the `jansAdminUIRole` claim. The saga calls `redirectToLogout()` from [`app/redux/sagas/SagaUtils.ts`](../app/redux/sagas/SagaUtils.ts), which surfaces a toast and forces sign-out.

After this, every Config API call goes through the shared axios instance in [`app/redux/api/axios.ts`](../app/redux/api/axios.ts), which carries both the `Authorization: Bearer <token>` header (from `setApiToken`) and `withCredentials: true` (so the session cookie travels with every request).

## License verification

### Why it exists

The Admin UI is part of **Gluu Flex**, a paid product. A working installation must have an active license — without one, the app shows a **license-error screen** instead of the normal sidebar, with options to upload a Software Statement Assertion (SSA) or start a 30-day trial. License verification runs immediately after OIDC sign-in and decides which screen the user sees: the normal app, or the license-error screen.

The check has two halves, run sequentially:

1. **Config check** ([`checkLicenseConfigValid`](../app/redux/sagas/LicenseSaga.ts)) — is the license-related OIDC configuration in persistence valid? In other words: is the Admin UI even able to _ask_ the License APIs anything?
2. **Presence check** ([`checkLicensePresent`](../app/redux/sagas/LicenseSaga.ts)) — given the config is valid, does this installation have an active license, and is the user under the licensed MAU (Monthly Active User) cap?

If either half fails, the user lands on the license-error screen. If both pass, the rest of the app renders.

### Flow diagram

```mermaid
sequenceDiagram
    autonumber
    participant Provider as AppAuthProvider
    participant Saga as LicenseSaga
    participant API as Jans Config API
    participant SCAN as SCAN License API
    participant Slice as licenseSlice
    participant UI as App shell

    Provider->>Saga: dispatch checkLicenseConfigValid()
    Saga->>API: setupApiToken()
    Saga->>API: checkAdminuiLicenseConfig()
    API-->>Saga: { success: true | false }
    Saga->>Slice: checkLicenseConfigValidResponse(success)

    Note over Provider,Slice: useEffect reacts to isConfigValid === true

    Provider->>Saga: dispatch checkLicensePresent()
    Saga->>API: isLicenseActive()
    alt active
        Saga->>Slice: checkLicensePresentResponse(isLicenseValid: true)
        Saga->>API: getStat(month) — MAU usage
        Saga->>Slice: checkThresholdLimit(isUnderThresholdLimit)
    else not active
        Saga->>API: retrieveLicense()
        API->>SCAN: /scan/license/retrieve
        SCAN-->>API: licenseKey or empty
        alt key found
            Saga->>API: activateAdminuiLicense({ licenseKey })
            Saga->>Slice: generateTrialLicenseResponse + threshold check
        else no key
            Saga->>Slice: isNoValidLicenseKeyFound: true
        end
    end

    Slice-->>UI: isLicenseValid? → render normal app : render license screen
```

### Explanation of the flow

The flow is driven by [`app/redux/sagas/LicenseSaga.ts`](../app/redux/sagas/LicenseSaga.ts), and the state it manipulates lives in [`app/redux/features/licenseSlice.ts`](../app/redux/features/licenseSlice.ts). It is kicked off by [`app/utils/AppAuthProvider.tsx`](../app/utils/AppAuthProvider.tsx) — two `useEffect`s, run sequentially, not in parallel.

**Step 1 — Config check.** `AppAuthProvider` dispatches `checkLicenseConfigValid()` once, guarded by a `hasDispatchedConfigCheck` ref. The saga's `checkAdminuiLicenseConfigWorker` runs `setupApiToken()` first — this calls `fetchApiTokenWithDefaultScopes`, stores the token in `licenseSlice` via `setApiDefaultToken`, and hands it to the Orval client with `setApiToken(...)` so the rest of the saga's Orval calls authenticate. It then calls the `checkAdminuiLicenseConfig` Orval hook, which asks the Config API whether the OIDC client used to talk to the License APIs is valid. The response is a `{ success: boolean }`. The saga dispatches `checkLicenseConfigValidResponse(success)`, which sets `state.licenseReducer.isConfigValid`.

If `isConfigValid` is `false`, the UI shows the SSA-upload screen and the flow stops. The user uploads a fresh SSA, which routes back through `uploadNewSsaToken` in the same saga; on success it re-runs the config check. If `isConfigValid` is `true`, a second `useEffect` in `AppAuthProvider` reacts and dispatches `checkLicensePresent()`.

**Step 2 — Presence check.** `checkLicensePresentWorker` again runs `setupApiToken()` and then calls the `isLicenseActive` Orval hook. The Config API asks the SCAN license server `/scan/license/isActive` (at most once per 30 days; otherwise it returns the cached result from persistence). If `success: true`, the response carries license fields (expiry, MAU cap, etc.) which the saga maps into the slice via `checkLicensePresentResponse({ isLicenseValid: true })`.

**Step 3 — MAU threshold.** With an active license, the saga also calls the `getStat` Orval hook for the current month and compares the licensed MAU cap against the current usage. If usage is under the cap, `checkThresholdLimit({ isUnderThresholdLimit: true })` is dispatched. If usage is over, it dispatches `false` and the UI shows a warning banner.

**Step 4 — Not active → retrieve.** If `isLicenseActive` returned `{ success: false }`, the saga falls into `retrieveLicenseKey`. This calls `retrieveLicense` (Orval), which asks the Config API to fetch the license from SCAN (`/scan/license/retrieve`). If SCAN returns a license key (meaning the user has subscribed in Agama Lab), the saga calls `activateAdminuiLicense({ licenseKey })`, dispatches `generateTrialLicenseResponse(...)`, and re-runs the MAU threshold check. If SCAN returns no key (the user has not subscribed), the saga dispatches `isNoValidLicenseKeyFound: true` and the UI offers a 30-day trial. The trial can only be generated once per Agama Lab user — `generateTrialLicense` follows the same retrieve/activate pattern but calls `getTrialLicense` instead.

**Error / network handling.** Every Orval call in `LicenseSaga` is wrapped to capture the failure shape via `getBackendStatusFromError`. The status code and error message are mirrored into `state.authReducer.backendStatus` so the global `GluuServiceDownModal` can render if the Config API is unreachable. A 403 on a license endpoint routes through `redirectToLogout()` from [`app/redux/sagas/SagaUtils.ts`](../app/redux/sagas/SagaUtils.ts) — that path means the OIDC token is valid but the user lacks the role to call the license endpoints, which is treated as a hard sign-out.

### Slice fields the UI reads

The `licenseSlice` exposes several booleans that the app shell uses to decide which screen to render:

- `isLicenseValid` — the master gate for normal app rendering.
- `islicenseCheckResultLoaded` — distinguishes "still loading the check" from "loaded and invalid".
- `isNoValidLicenseKeyFound`, `error`, `errorSSA` — drive the license-error screen sub-states (trial offer, SSA upload prompt, plain error).
- `isConfigValid` — the result of the config-check half. Tracked separately from `isLicenseValid` because the config check can fail on its own and produces the SSA-upload screen.
- `isUnderThresholdLimit` — drives the MAU warning banner.
- `isValidatingFlow`, `generatingTrialKey`, `isLoading` — UI spinner state on the license screens.

## Tokens

Three different tokens, **not interchangeable**:

- **OIDC `id_token`** — JWT proof of identity. Decoded by `jwt-decode` to populate `userinfo`. Stored in `state.authReducer.userinfo` and persisted via `redux-persist` (so a page reload doesn't kick the user out).
- **OIDC `access_token` (UI scopes)** — for the UI's own calls back to the issuer (e.g. fetching the userinfo endpoint). Held by AppAuth's `LocalStorageBackend` per the OAuth spec.
- **Config API access token** — separate from the OIDC access token. Fetched by `fetchApiTokenWithDefaultScopes` in [`app/redux/sagas/AuthSaga.ts`](../app/redux/sagas/AuthSaga.ts) and handed to the Orval client via `setApiToken(...)`. Every Orval hook uses **this** token, not the OIDC one.

Never reach into `localStorage` directly for tokens — go through [`app/utils/TokenController.ts`](../app/utils/TokenController.ts) or `AuthSaga`.

## Storage keys

`localStorage` is used for state that needs to be readable **before** React and Redux even boot — theme and language need to be available for the first paint, otherwise the user sees a flash of the wrong theme. Every key lives in [`app/constants/storageKeys.ts`](../app/constants/storageKeys.ts); inline string keys are a lint regression.

| Key                        | Feature                                      | Set by                              | Read by                               |
| -------------------------- | -------------------------------------------- | ----------------------------------- | ------------------------------------- |
| `USER_CONFIG`              | User prefs blob (theme + language)           | `LanguageMenu`, `ThemeDropdown`     | `i18n.ts`, `themeContext`             |
| `INIT_THEME`               | UI theme (light/dark)                        | `themeContext`, `logoutSlice` reset | `themeContext`, `default.tsx` layout  |
| `INIT_LANG`                | UI language                                  | `LanguageMenu`, `logoutSlice` reset | `i18n.ts`, `LanguageMenu`             |
| `USER_INFO`                | Decoded OIDC `userinfo` (theme/lang restore) | `AppAuthProvider` on sign-in        | `themeContext`                        |
| `ISSUER`                   | OIDC issuer URL                              | `TokenController` after discovery   | `TokenController` on subsequent boots |
| `POST_LOGOUT_REDIRECT_URI` | Where to send the user after end-session     | `AuthSaga` from OAuth2 config       | `ByeBye.tsx` as fallback              |

## 401 vs 403

The Config API rejects with two distinct status codes that mean different things:

- **401 (unauthorized)** — the token is missing, expired, or invalid. AppAuth handles this as a normal token lifecycle event: it refreshes or re-authenticates the user.
- **403 (forbidden)** — the token is fine, but the action is denied. This generally means Cedarling rejected the action, or the user does not have the right role. The UI surfaces a permission-error toast rather than signing the user out.

`isFourZeroThreeError(err)` in [`app/utils/TokenController.ts`](../app/utils/TokenController.ts) distinguishes the two. When you write a new mutation, surface 403 separately — do not collapse it into "session expired" — the user is still signed in; they simply do not have permission for this specific action.

## Idle timeout

Users who leave the Admin UI open without interaction are signed out automatically — this protects browser tabs left unattended on shared machines.

[`app/routes/Apps/Gluu/GluuSessionTimeout.tsx`](../app/routes/Apps/Gluu/GluuSessionTimeout.tsx) wraps the app using `react-idle-timer`. The defaults are five minutes idle, then a ten-second countdown modal warning the user, then a forced logout. The idle window is configurable per environment via `sessionTimeoutInMins` on the auth slice. When the modal countdown expires, the component dispatches `auditLogoutLogs` (so the involuntary logout is captured in the audit trail) and navigates the browser to `/logout`. From there, the logout flow below takes over.

## Logout

Logout is one cleanup path with three different triggers. All of them end up routing the browser to `/logout`, which is served by [`app/routes/Pages/ByeBye.tsx`](../app/routes/Pages/ByeBye.tsx).

### Trigger paths

- **User-initiated** — the sidebar logout link routes to `/logout` → `ByeBye.tsx`.
- **Forced** — `redirectToLogout(message)` in [`app/redux/sagas/SagaUtils.ts`](../app/redux/sagas/SagaUtils.ts) is called when a saga hits a fatal auth error (e.g. 403 from `createAdminUiSession`). It does best-effort cleanup and then sets `window.location.href = '/admin/logout'`.
- **Idle timeout** — `GluuSessionTimeout` dispatches `auditLogoutLogs` first (so the involuntary exit is audited) and then navigates to `/logout`.

### What `ByeBye.tsx` does, in order

1. `dispatch(setAuthState({ state: false }))` — flips the auth flag immediately so any guarded UI hides while the rest of the cleanup runs.
2. If `state.authReducer.hasSession` is `true`, calls `deleteAdminUiSession()` against `ENDPOINTS.SESSION` (DELETE) so the Config API invalidates the admin-UI session cookie. Failures are logged but do not block the rest of logout.
3. `dispatch(logoutUser())` — the `logoutSlice` reducer wipes `localStorage` of tokens and userinfo, **preserves** `USER_CONFIG`, and resets `INIT_THEME` + `INIT_LANG` to defaults so the next visitor lands on a clean theme.
4. If the OAuth config has an `endSessionEndpoint`, builds the end-session URL with `buildSafeLogoutUrl(endSessionEndpoint, postLogoutRedirectUri, state)` (from [`app/utils/urlSecurity.ts`](../app/utils/urlSecurity.ts)) and redirects there. Jans clears its own session and returns the browser to the redirect URI.
5. **Fallback** — if no `endSessionEndpoint` is available, redirects to the URL in `STORAGE_KEYS.POST_LOGOUT_REDIRECT_URI` (validated via `buildSafeNavigationUrl`), or `/` as a last resort.

`buildSafeLogoutUrl` and `buildSafeNavigationUrl` exist because constructing these URLs by hand is error-prone — a crafted `post_logout_redirect_uri` is a URL-injection vector. Always go through them.

## OAuth scopes vs Cedarling resource scopes

Two unrelated things are both called "scopes":

- **OIDC scopes** are declared in the auth config the Jans server hands back; AppAuth lists them in the `AuthorizationRequest`. They control what the OIDC token can be used for.
- **Cedarling resource scopes** are declared in [`app/cedarling/constants/resourceScopes.ts`](../app/cedarling/constants/resourceScopes.ts) and evaluated at the page boundary by `useCedarling()`. They control which UI elements render for which role.

A user can be signed in (OIDC scopes valid) but unauthorized (Cedarling denies). That is the normal case for role-restricted pages — see [cedarling.md](./cedarling.md).

## Debugging tips

- AppAuth has a verbose log flag. At the top of [`app/utils/AppAuthProvider.tsx`](../app/utils/AppAuthProvider.tsx), calling `setFlag('IS_LOG', true)` traces the OAuth flow locally. Useful for tracking down redirect mismatches. Never ship with this flag enabled.
- `redux-devtools` shows the full `authReducer` slice, including tokens — useful for diagnosing "wrong token sent" issues. If the Config API rejects with `invalid_token`, the most common cause is that `setApiToken` was not yet called (visible in the AuthSaga trace) or that the OIDC `access_token` was sent in place of the Config API token. They look similar but are not the same JWT.
- If the user is bounced back to the login screen immediately after sign-in, the cause is almost always the `createAdminUiSession` 403 path — the user signed in but does not have the `jansAdminUIRole` claim. Check the Jans Auth Server's user record.
