# Conventions

The repo enforces most of this via lint + the pre-commit hook. Treat it as a quick reference; in doubt, the linter is authoritative.

## Imports

| Pattern                                       | Rule                                                           |
| --------------------------------------------- | -------------------------------------------------------------- |
| Plugin A → Plugin B internals                 | ❌ never                                                       |
| `app/` → `Plugins/...` (for plugin code)      | ❌ never                                                       |
| `plugin` → `@/...` (host)                     | ✅                                                             |
| `plugin` → `@/constants` for shared constants | ✅                                                             |
| Self-imports inside a plugin                  | use the `Plugins/<self>/...` alias or relative — both are fine |

Path aliases in `tsconfig.json`:

| Alias                                          | Resolves to                |
| ---------------------------------------------- | -------------------------- |
| `@/*`                                          | `app/*`                    |
| `Plugins/*`                                    | `plugins/*`                |
| `Routes/*`, `Utils/*`, `Components`, `Redux/*` | their `app/` subfolders    |
| `JansConfigApi`                                | the Orval-generated client |

## Constants

| Where it's used                       | Where it lives                                                         |
| ------------------------------------- | ---------------------------------------------------------------------- |
| Across multiple plugins, or by `app/` | `app/constants/` (exposed via `@/constants` barrel)                    |
| Inside one plugin only                | that plugin's own `common/Constants.ts` (or `components/constants.ts`) |
| Inside one component only             | a local `const` is fine                                                |

Magic literals in code (storage keys, language codes, service names, date formats, attribute names, audit actions, status values) **must** reference a constant — no inline `'jans-lock'`, `'YYYY-MM-DD'`, `'userId'`, etc.

## Types

- Types live in `types.ts` (or a sibling `types/` folder), never inline in component files.
- Use `type` aliases, not `interface`, in dedicated types files.
- No `any`, no `unknown` as a public type, no `as unknown as`, no unknown index signatures, no `never` casts.

## Regex

Every regex literal lives in `app/utils/regex.ts` with a `REGEX_` prefix. Never declare regex inline in components or modules.

## Logging

Use `devLogger` from `@/utils/devLogger` — never `console.log/warn/error` in source. (`console` is allowed only in build scripts.)

## Loaders

Use `GluuLoader` for any blocking/loading UI. The reactstrap `Spinner` and MUI `CircularProgress` are not allowed except in the sidebar.

## i18n

When adding a translation key, update **all four** locale files: `en`, `es`, `fr`, `pt`. English-only changes will be caught at review.

## Lint / type-check / format

- Don't suppress: no `eslint-disable`, no `// @ts-ignore`, no `// @ts-expect-error`. Fix the cause.
- `npm run check:all` runs ESLint + markdownlint + `tsc` together — use this before committing if you skipped the hook for any reason.
- `npm run format` runs Prettier (covers `.md` too).

## Commits

- Sign every commit: `git commit -S -s` (`-S` is mandatory in this repo; `commit.gpgsign` is not set globally).
- Don't add a `Co-Authored-By: Claude` trailer.
- Branch naming: `admin-ui-issue-<n>` (matches the GitHub issue you're addressing).

## Pre-commit hook

Husky runs Prettier + ESLint + `tsc` + markdownlint on commit (across the staged JS/TS/JSON/CSS/SCSS/MD subset). If it fails: fix locally, re-stage, commit again. Don't bypass with `--no-verify` unless explicitly approved.

## Don't introduce comments

The codebase intentionally has almost zero code comments. Only add one when the _why_ is non-obvious (hidden constraint, subtle invariant, workaround for a known bug). Never describe _what_ — the code already does that.
