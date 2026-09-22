# Conventions

Most of this is enforced by ESLint, TypeScript, Prettier, or the husky pre-commit hook. The linter is authoritative. This doc is the reference for the things tooling can't enforce.

## Imports

| Pattern                                       | Rule                                               |
| --------------------------------------------- | -------------------------------------------------- |
| Plugin A → Plugin B internals                 | ❌ never                                           |
| `app/` → `Plugins/...`                        | ❌ never                                           |
| `plugin` → `@/...` (host)                     | ✅                                                 |
| `plugin` → `@/constants` for shared constants | ✅                                                 |
| Self-imports inside a plugin                  | `Plugins/<self>/...` alias or relative (both fine) |

Two plugins need to share something → lift it into `app/`. The host must not depend on a plugin. See [architecture.md](./architecture.md).

### Path aliases

| Alias                                                                               | Resolves to                |
| ----------------------------------------------------------------------------------- | -------------------------- |
| `@/*`                                                                               | `app/*`                    |
| `Plugins/*`                                                                         | `plugins/*`                |
| `Routes/*`, `Utils/*`, `Components`, `Redux/*`, `Context/*`, `Styles/*`, `Images/*` | Their `app/` subfolders    |
| `Orval`, `Orval/*`                                                                  | `orval/index`, `orval/*`   |
| `JansConfigApi`                                                                     | The Orval-generated client |

Prefer aliases for cross-folder imports. Moving a file doesn't break dozens of `../../` paths.

## Constants

Magic literals. Storage keys, language codes, service names, date formats, attribute names, audit actions, status values. Must reference a named constant. No inline `'jans-lock'`, `'YYYY-MM-DD'`, `'userId'`.

| Where it's used                       | Where it lives                                                  |
| ------------------------------------- | --------------------------------------------------------------- |
| Across multiple plugins, or by `app/` | `app/constants/` (via `@/constants` barrel)                     |
| Inside one plugin only                | Plugin's own `common/Constants.ts` or `components/constants.ts` |
| Inside one component only             | Local `const`                                                   |

Don't pre-emptively hoist single-use constants. Lift when a second plugin needs them, not "might one day."

## Types

- **Types live in `types.ts`** (or a sibling `types/` folder), never inline in component files. Even `type Props = {…}`.
- **Use `type` aliases, not `interface`** in dedicated types files. `export type Props = {…}` is the convention.
- **No escape hatches**: no `any`, no `unknown` as a public type, no `as unknown as`, no unknown index signatures, no `never` casts. Fix the underlying type.

## Regex

Every regex lives in `app/utils/regex.ts` with the `REGEX_` prefix:

```ts
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

```ts
import { REGEX_EMAIL } from '@/utils/regex'
```

Never declare a regex inline. Naming centralizes audits and makes call sites readable.

## Logging

Use `logger` from `@/utils/logger`. Never call `console.log` / `console.warn` / `console.error` directly in source.

```ts
import { logger } from '@/utils/logger'
logger.warn('Something to know about', context)
```

`logger` exposes `trace` / `debug` / `info` / `warn` / `error`. Each call is dropped unless its level is at or above the level stored in `localStorage` under `gluu.logLevel`, which the Settings page writes and which defaults to `INFO`. The gate is the same in dev and production builds. Raw `console.*` bypasses it. Build scripts under `script/` are allowed to use `console` directly. They don't ship to the browser.

Code under `app/cedarling/`, and the Cedarling lines in `PermissionsPolicyInitializer`, use `cedarLogger` from `@/cedarling/utility/cedarLogger` instead. It wraps `logger` with a second gate so Cedarling output also respects the "Cedarling logs?" switch. See [cedarling.md](./cedarling.md#logging).

## Styling

Component styles go in a sibling `*.style.ts` using `makeStyles` from `tss-react/mui`, colors come from the theme rather than literals, and every page has to work across the full supported range, 320px to 1440px - phones, tablets in both orientations, and laptops, not just the desktop width you built it at. Full rules in [styling.md](./styling.md).

## Loaders

Use `GluuLoader` for any blocking / loading UI. Wrap content with `<GluuLoader blocking={isLoading}>{children}</GluuLoader>` to show the standard overlay, or render `<GluuLoader blocking />` standalone when there's nothing to wrap.

## Internationalization

Four locales: `en`, `es`, `fr`, `pt`. Translations in `app/locales/<lang>/translation.json`.

Add every key to all four files in the same commit. The i18n fallback returns English when a key is missing, so English-only changes are invisible until a non-English user opens the page. If you don't speak the others, copy the English value and flag it in the PR. A translator replaces it later.

## Lint, type-check, format

- **Don't suppress**: no `eslint-disable`, no `// @ts-ignore`, no `// @ts-expect-error`. Fix the cause.
- **`npm run check:all`** runs ESLint + markdownlint + `tsc`. Run before committing if you skipped the pre-commit hook.
- **`npm run format`** runs Prettier across `.ts/.tsx/.js/.jsx/.json/.css/.scss/.md/.html/.cjs`: auto-applies fixes.

## Commits

- **GPG-sign:** `git commit -S -s "<message>"`. `-S` is mandatory (`commit.gpgsign` is not set globally). `-s` adds sign-off.
- **No `Co-Authored-By: Claude` trailer**: clean commit history.
- **Branch naming:** `admin-ui-issue-<n>` matching the GitHub issue.

## Pre-commit hook

Husky runs Prettier, ESLint, a deprecated-API check, `tsc`, markdownlint and knip. Prettier, ESLint and markdownlint work on the staged `.js/.jsx/.ts/.tsx/.json/.css/.scss/.md` subset; `tsc` and knip run over the whole project. Failure aborts the commit. Fix, re-stage, commit again. The test suite is not part of any hook.

Three separate gates guard the commit itself:

- **`pre-commit`** refuses to run unless commit signing is possible: either `commit.gpgsign=true` or a `user.signingkey` is configured.
- **`commit-msg`** requires a `Signed-off-by:` trailer, which `git commit -s` adds.
- **`pre-push`** re-checks every commit being pushed and blocks any that carries no signature.

In practice that means committing with `git commit -S -s -m "<message>"`.

Don't bypass with `--no-verify` unless approved. CI does not run lint or type-check, so if you skip the hook nothing catches those before merge except running `npm run check:all` yourself (see [build-deploy.md](./build-deploy.md#ci)).

## Comments

Comments are welcome when they help a future reader: a non-obvious constraint, a subtle invariant, a workaround for a known bug, a reason the code looks the way it does. Add one whenever the _why_ wouldn't be clear from reading the code alone.

Skip them when the names already explain _what_ the code does. A comment that just restates the call sites tends to drift out of sync with the code over time.
