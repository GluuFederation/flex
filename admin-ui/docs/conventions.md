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

Use `devLogger` from `@/utils/devLogger`. Never call `console.log` / `console.warn` / `console.error` directly in source.

```ts
import { devLogger } from '@/utils/devLogger'
devLogger.warn('Something to know about', context)
```

Production builds drop debug logs through this wrapper. Raw `console.*` leaks. Build scripts under `script/` are allowed to use `console` directly. They don't ship to the browser.

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

Husky runs Prettier, ESLint, `tsc`, markdownlint across staged `.js/.jsx/.ts/.tsx/.json/.css/.scss/.md`. Failure aborts the commit. Fix, re-stage, commit again.

Don't bypass with `--no-verify` unless approved. The hook is the only enforcement point. CI doesn't re-run lint or tests (see [build-deploy.md](./build-deploy.md#ci--jenkins)).

## Comments

Comments are welcome when they help a future reader: a non-obvious constraint, a subtle invariant, a workaround for a known bug, a reason the code looks the way it does. Add one whenever the _why_ wouldn't be clear from reading the code alone.

Skip them when the names already explain _what_ the code does. A comment that just restates the call sites tends to drift out of sync with the code over time.
