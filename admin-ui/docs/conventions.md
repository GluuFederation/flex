# Conventions

## Introduction

This document collects the coding conventions the Admin UI codebase follows. Most of them are enforced automatically — by ESLint, by TypeScript, by Prettier, or by the husky pre-commit hook — so you don't have to memorize them all. The pre-commit hook will tell you when you've broken something.

That said, a handful of rules are _not_ enforceable by tooling — they are about where to put code, what to name things, and which patterns to reach for vs. avoid. This doc is the place to look those up. Read it once when you start; skim it when you can't remember which folder a constant belongs in.

When in doubt, the linter and the existing code are the authoritative references. If the existing code disagrees with this document, the document is probably out of date — flag it and fix.

## Imports

The Admin UI's [host / plugin architecture](./architecture.md) is held together by strict import rules. Breaking these rules silently re-introduces the tight coupling the architecture exists to prevent.

| Pattern                                       | Rule                                                              |
| --------------------------------------------- | ----------------------------------------------------------------- |
| Plugin A → Plugin B internals                 | ❌ never                                                          |
| `app/` → `Plugins/...` (for plugin code)      | ❌ never                                                          |
| `plugin` → `@/...` (host)                     | ✅                                                                |
| `plugin` → `@/constants` for shared constants | ✅                                                                |
| Self-imports inside a plugin                  | Use the `Plugins/<self>/...` alias or a relative path — both fine |

If two plugins need to share something, the answer is **not** to import across — it's to lift the shared thing into `app/`. Likewise, the host (`app/`) must not depend on any specific plugin, because that defeats the modular split. See [architecture.md](./architecture.md#the-host--plugin-split).

### Path aliases

The aliases in `tsconfig.json` (and mirrored in `jest.config.ts`'s `moduleNameMapper`) shorten long import paths and serve as architectural markers — every alias signals "this is a stable import target":

| Alias                                          | Resolves to                |
| ---------------------------------------------- | -------------------------- |
| `@/*`                                          | `app/*`                    |
| `Plugins/*`                                    | `plugins/*`                |
| `Routes/*`, `Utils/*`, `Components`, `Redux/*` | Their `app/` subfolders    |
| `JansConfigApi`                                | The Orval-generated client |

Prefer aliases for any cross-folder import. They make refactors safer — moving `app/utils/regex.ts` does not break dozens of `../../utils/regex` imports.

## Constants

Magic literals in code — storage keys, language codes, service names, date formats, attribute names, audit actions, status values — must reference a named constant. Inline strings like `'jans-lock'`, `'YYYY-MM-DD'`, or `'userId'` are not OK; if the value ever changes, you find it through grep with no guarantee of completeness.

The placement rule:

| Where it's used                       | Where it lives                                                         |
| ------------------------------------- | ---------------------------------------------------------------------- |
| Across multiple plugins, or by `app/` | `app/constants/` (exposed via the `@/constants` barrel)                |
| Inside one plugin only                | That plugin's own `common/Constants.ts` (or `components/constants.ts`) |
| Inside one component only             | A local `const` is fine                                                |

Don't pre-emptively hoist single-use constants into `app/constants/` — the rule is "two plugins need it, then lift", not "this might be used elsewhere someday".

## Types

A few rules keep the TypeScript surface clean:

- **Types live in `types.ts`** (or a sibling `types/` folder), never inline in component files. Even a small `type Props = {…}` should move out. This keeps components focused on logic and types findable.
- **Use `type` aliases, not `interface`**, in dedicated types files. `export type Props = {…}` is preferred over `export interface Props {…}` — both work, but the codebase is consistent on `type`.
- **No escape hatches.** `any`, `unknown` as a public type, `as unknown as`, unknown index signatures, and `never` casts are all banned. If TypeScript is complaining, fix the underlying type — bypassing it always comes back to bite.

If a type really cannot be expressed cleanly, the answer is to model the data differently, not to suppress the error.

## Regex

Every regex literal lives in `app/utils/regex.ts` with the `REGEX_` prefix:

```ts
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

Imported wherever it's needed:

```ts
import { REGEX_EMAIL } from '@/utils/regex'
```

Never declare a regex inline in a component, hook, or module. The reason is two-fold: regex is hard to read, so naming it (`REGEX_EMAIL`) makes the call site self-explanatory; and centralizing them lets you audit and update them in one place.

## Logging

Use `devLogger` from `@/utils/devLogger`. Never call `console.log`, `console.warn`, or `console.error` directly in source code.

```ts
import { devLogger } from '@/utils/devLogger'

devLogger.warn('Something to know about', context)
```

`devLogger` is a thin wrapper that respects the build mode — in production builds, debug-level logs are dropped, so the user's console isn't polluted with noise. Direct `console.*` calls bypass this and leak into production.

Build scripts under `script/` are allowed to use `console` directly — they don't ship to the browser.

## Loaders

For any blocking or loading UI, use `GluuLoader`. The reactstrap `Spinner` and MUI's `CircularProgress` are **not** allowed in feature code — they are inconsistent with the rest of the UI and lack the framing `GluuLoader` provides.

The one exception is the sidebar, which has its own loading affordance and is allowed to use a plain spinner.

## Internationalization

The Admin UI supports four locales: English, Spanish, French, Portuguese. Translations live in `app/locales/<lang>/translation.json`.

When you add a translation key, update **all four** files in the same commit. The i18n fallback chain returns the English value when a key is missing, so an English-only change is invisible until a non-English user opens the page — at which point the bug looks worse than it is.

If you don't speak the other three languages, copy the English value into the other files and flag it in the PR description. A translator can replace the placeholder later.

## Lint, type-check, format

The repo enforces format and types automatically. A few principles:

- **Don't suppress.** No `eslint-disable`, no `// @ts-ignore`, no `// @ts-expect-error`. If the linter is complaining, fix the cause. Suppression flags are tracked carefully because they accumulate and rot.
- **`npm run check:all`** runs ESLint + markdownlint + `tsc` together. Run this before committing if you skipped the pre-commit hook for any reason. It's the same script CI would run if CI ran it (it doesn't — see [build-deploy.md](./build-deploy.md#ci--jenkins) — but pre-commit catches everything).
- **`npm run format`** runs Prettier. It covers `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.scss`, `.md`, `.html`, and `.cjs`. Auto-applies fixes.

## Commits

The commit conventions for this repo are short:

- **GPG-sign every commit:** `git commit -S -s "<message>"`. `-S` is mandatory; `commit.gpgsign` is not set globally, so each commit must opt in. `-s` adds the standard sign-off line.
- **No `Co-Authored-By: Claude` trailer.** AI assistance is fine, but the team prefers a clean commit history without AI co-author noise.
- **Branch naming:** `admin-ui-issue-<n>` where `<n>` is the GitHub issue number you're addressing.

## Pre-commit hook

The husky pre-commit hook runs Prettier, ESLint, `tsc`, and markdownlint across the staged subset of files (`.js` / `.jsx` / `.ts` / `.tsx` / `.json` / `.css` / `.scss` / `.md`). If anything fails, the commit is aborted — fix locally, re-stage, commit again.

Do not bypass with `--no-verify` unless explicitly approved. The pre-commit hook is the only enforcement point in the merge path (CI does not re-run lint or tests — see [build-deploy.md](./build-deploy.md#ci--jenkins)), so a bypass goes straight to merge.

## Don't introduce comments

The codebase intentionally has almost zero code comments. The reasoning is that well-named identifiers already describe _what_ the code does; comments describing _what_ drift and lie, while the code stays honest.

Add a comment only when the _why_ is non-obvious — a hidden constraint, a subtle invariant, a workaround for a known bug, a deliberate non-fix because the obvious fix breaks something downstream. Never describe _what_ the code is doing; the code already does that.

## Where to read next

- [architecture.md](./architecture.md) — why the host / plugin split exists and what it means for imports
- [recipes.md](./recipes.md) — concrete step-by-steps that follow these conventions
- [tech-stack.md](./tech-stack.md) — the tools mentioned here and why they're used
