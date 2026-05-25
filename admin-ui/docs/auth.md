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

`app/constants/storageKeys.ts` is the single source of truth:

```ts
STORAGE_KEYS = {
  USER_CONFIG,
  INIT_THEME,
  INIT_LANG,
  USER_INFO,
  ISSUER,
  POST_LOGOUT_REDIRECT_URI,
}
```

Add to this file before writing anything new to `localStorage`. Inline string keys are a lint regression.

## 401 vs 403

- **401 (unauthorized)** — handled by AppAuth: refresh / re-auth as a normal token lifecycle event.
- **403 (forbidden)** — distinct path. `isFourZeroThreeError(err)` in `TokenController.ts` distinguishes it. A 403 generally means Cedarling denied (auth is fine, permission isn't); the UI surfaces a permission error rather than logging the user out.

When you write a new mutation, surface 403 separately — don't collapse it into "session expired."

## Idle timeout

`GluuSessionTimeout` wraps the app via `react-idle-timer`. Default 5 minutes idle → 10-second countdown modal → forced logout. Configurable per environment (`sessionTimeoutInMins` from the auth slice).

When the modal countdown expires, `auditLogoutLogs` is dispatched (so the logout is auditable) before navigation away.

## Logout

Two paths:

1. **User-initiated** — clicks logout → `buildSafeLogoutUrl(...)` constructs an OIDC `end_session_endpoint` URL with `state` + `post_logout_redirect_uri`. Browser is redirected there; Jans clears the session and returns to the redirect URI.
2. **Forced** (saga) — `redirectToLogout(message)` in `SagaUtils.ts`. Used when a request returns a fatal auth error. Best-effort cleanup, then `window.location.href = '/admin/logout'`.

`buildSafeLogoutUrl` exists because hand-building the URL is easy to get wrong (URL injection via crafted `post_logout_redirect_uri`). Always use it.

## OAuth scopes

The UI scopes (what the OIDC flow asks for) and the Cedarling resource scopes (what the policy store grants per page) are **separate concerns**:

- OIDC scopes → declared in the auth config the Jans Server hands back; AppAuth requests them in the `AuthorizationRequest`.
- Cedarling resource scopes → declared in `app/cedarling/constants/resourceScopes.ts` and evaluated at the page boundary via `useCedarling()`.

A user can be signed in (OIDC valid) but not authorized (Cedarling denies) — that's the normal case for role-restricted pages.

## Debugging tips

- AppAuth has a verbose log flag — at the top of `AppAuthProvider.tsx`: `setFlag('IS_LOG', true)` to trace flows locally. Don't ship `true`.
- `redux-devtools` shows the full `authReducer` slice, including tokens — useful for diagnosing "wrong token sent" issues.
- If the Config API rejects with `invalid_token`, check that `setApiToken` ran (visible in the AuthSaga) and that the token isn't the OIDC token by mistake.
