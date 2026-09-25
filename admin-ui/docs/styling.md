# Styling, theming and responsive design

How a page gets its look. Three layers, in the order you will meet them: component styles written with tss-react, a theme that supplies every colour, and a set of media queries that decide what renders on a phone.

## Component styles: `*.style.ts` + `useStyles`

Styles live in a sibling file next to the component, named after it. `Foo.tsx` has `Foo.style.ts`. Larger folders keep them in a `styles/` subfolder. Around 139 style files follow this shape:

```ts
import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontSizes } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/types'

export const useStyles = makeStyles<{ colors: ThemeConfig }>()((theme, { colors }) => ({
  root: {
    backgroundColor: colors.background,
    color: colors.fontColor,
    fontFamily,
    fontSize: fontSizes.md,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
}))
```

The component calls it and spreads the returned classes:

```tsx
const { classes, cx } = useStyles({ colors: themeColors })

return <div className={cx(classes.root, isActive && classes.rootActive)}>…</div>
```

Two parameters arrive in the callback. `theme` is the MUI theme, useful for `theme.breakpoints`, `theme.zIndex` and spacing. The second is whatever the component passes in, which is almost always the resolved theme colors, and sometimes an `isDark` boolean.

Rules:

- `makeStyles` comes from `tss-react/mui`. `@mui/styles` is deprecated and blocked by `no-restricted-imports`.
- Use `cx` from the same hook to combine classes, not template strings.
- Reach for the `sx` prop only for a one-off tweak that is not worth a style file. Anything reused, conditional on theme, or longer than a couple of properties belongs in `*.style.ts`.
- Never hard-code a colour. Take it from the theme (below) or from [`app/customColors.ts`](../app/customColors.ts).
- Font family, sizes, weights, letter spacing and line heights come from [`app/styles/fonts.ts`](../app/styles/fonts.ts).

## Theming

Two themes, light and dark. **Dark is the default** (`DEFAULT_THEME` in [`app/context/theme/constants.ts`](../app/context/theme/constants.ts)).

`ThemeProvider` wraps the app and keeps the current theme in a reducer. Read it with `useTheme`, then resolve it to a colour set:

```tsx
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'

const { state } = useTheme()
const isDark = (state.theme ?? DEFAULT_THEME) === THEME_DARK
const themeColors = getThemeColor(state.theme)
```

`getThemeColor` returns a [`ThemeConfig`](../app/context/theme/types/ThemeConfigTypes.ts): a flat record of named colors (`background`, `fontColor`, `borderColor`, `inputBackground`, `errorColor`) plus nested groups for specific surfaces (`menu`, `navbar`, `card`, `infoAlert`, `checkbox`). An unrecognised value falls back to the default theme, so it is safe to pass whatever is in state.

Pass the resolved colors into `useStyles` rather than resolving them inside the style file. Style files stay pure functions of their parameters, which is what keeps them testable. This says nothing about the MUI `theme` argument: reading `theme.breakpoints`, `theme.zIndex` or spacing inside a style file is the intended pattern.

The selected theme also lands on `document.documentElement` as a `theme-light` / `theme-dark` class, which is what the SCSS layer hooks into. It is persisted under the `INIT_THEME` storage key (`initTheme`), and `index.html` carries a small pre-paint script that reads that key directly and sets the class before the bundle loads, so there is no flash of the wrong theme. See [auth.md](./auth.md#storage-keys) for the storage keys.

Opacity values and scrollbar styling are centralised in [`app/constants/ui.ts`](../app/constants/ui.ts), including theme-aware helpers such as `getHoverOpacity(isDark)` and `getDividerOpacity(isDark)`. Use them instead of inventing per-component alpha values.

## Responsive design

The app supports **320px to 1440px**: small phones at the bottom end, phones and tablets in portrait, tablets in landscape, and laptops at the top. A layout is not finished until it holds together across that whole range. Tablet widths are the ones that get skipped, because work usually gets checked on a desktop and then on a phone, with nothing in between.

Named breakpoints live in [`app/constants/ui.ts`](../app/constants/ui.ts):

| Constant                        | Value                   | Meaning                                      |
| ------------------------------- | ----------------------- | -------------------------------------------- |
| `MOBILE_MEDIA_QUERY`            | `(max-width:767px)`     | Phone layout                                 |
| `NON_MOBILE_MIN_MEDIA_QUERY`    | `(min-width:768px)`     | Tablet and up                                |
| `STACKED_CHART_MAX_MEDIA_QUERY` | `(max-width:1499.98px)` | Charts stack instead of sitting side by side |
| `MOBILE_BOTTOM_NAV_HEIGHT`      | `64`                    | Height the bottom nav occupies               |

Two ways to respond to them, and the choice matters:

**In components, branch on `useMediaQuery`.** This is the common case, used in over a hundred files, and it is how a component decides to render something different rather than merely look different:

```tsx
import useMediaQuery from '@mui/material/useMediaQuery'
import { MOBILE_MEDIA_QUERY } from '@/constants'

const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
```

**In style files, use `theme.breakpoints`.** For pure presentation, keep the responsiveness in CSS so it costs no re-render:

```ts
[theme.breakpoints.down('sm')]: { paddingLeft: MOBILE_PAGE_PADDING_X.SM }
```

No custom breakpoints are configured, so `theme.breakpoints` uses the MUI defaults: `xs` 0, `sm` 600, `md` 900, `lg` 1200, `xl` 1536. `down('md')` and `down('sm')` are the two you will see most. Note that these do not line up with `MOBILE_MEDIA_QUERY` at 767px, so a component that branches on `useMediaQuery` and styles itself with `down('sm')` will change behaviour at two different widths. Pick one boundary per element and stay on it.

Raw media-query strings do appear in a handful of style files (1024px, 1200px, 480px and others). Prefer a named constant, and add one to `app/constants/ui.ts` if the width you need is missing.

### Mobile-only components

Below the mobile breakpoint the app swaps in dedicated components rather than reflowing the desktop ones:

| Component                                                                               | Replaces                 |
| --------------------------------------------------------------------------------------- | ------------------------ |
| [`MobileBottomNav`](../app/components/MobileBottomNav/MobileBottomNav.tsx)              | Sidebar navigation       |
| [`MobileNavSheet`](../app/components/MobileBottomNav/MobileNavSheet.tsx)                | Sidebar submenus         |
| [`MobileProfileDropdown`](../app/routes/components/Dropdowns/MobileProfileDropdown.tsx) | Desktop profile dropdown |

These gate themselves. `MobileBottomNav` is rendered unconditionally by [`app/layout/default.tsx`](../app/layout/default.tsx) and returns `null` when `useMediaQuery(MOBILE_MEDIA_QUERY)` is false. Follow that pattern for new mobile-only UI: let the component decide, so the layout stays readable.

### Widths to check

Nothing in CI catches a broken layout, so check by hand. These six widths cover the range and the places things usually break:

| Width    | What it represents                       |
| -------- | ---------------------------------------- |
| `320px`  | Smallest supported phone                 |
| `375px`  | Common phone                             |
| `768px`  | Tablet portrait, and the mobile boundary |
| `1024px` | Tablet landscape / small laptop          |
| `1280px` | Laptop                                   |
| `1440px` | Largest supported width                  |

`768px` deserves particular attention: it is exactly where `MOBILE_MEDIA_QUERY` stops matching and `NON_MOBILE_MIN_MEDIA_QUERY` starts, so the mobile components disappear and the desktop layout takes over. Check a pixel either side of it.

A page that only works on a desktop is an incomplete page.

## The SCSS layer

Alongside the CSS-in-JS there is a small stylesheet layer under [`app/styles/`](../app/styles/). [`app/layout/default.tsx`](../app/layout/default.tsx) imports three entry files, in this order:

1. `bootstrap-overrides.scss` pulls in `miltonbo/scss/bootstrap/overrides.scss`: the app's own rules for Bootstrap markup, such as buttons, form controls, tabs, modals, alerts, badges, cards and tables.
2. `main.scss` holds global keyframes and element styles, and it pulls in the `miltonbo/` bundle and `custom/sidebar.scss`. Partials under `components/` are not imported here; a component imports them directly when it needs one, as `Wizard.tsx` does with `components/wizard.scss`.
3. `bootstrap.scss` is a pruned Bootstrap build from `miltonbo/scss/bootstrap/bootstrap.scss`. Only the utility classes the app actually uses are generated. Do not re-enable the full utility API or the per-colour loops; they produced hundreds of unused selectors and were deliberately removed.

The order is part of the look. When two rules have the same specificity, the one loaded later wins, so Bootstrap's own rules win over the same selectors in `overrides.scss` and `main.scss`. Moving an import changes which rule wins, so leave the order as it is. To restyle a Bootstrap element, use a more specific selector or a `*.style.ts` file.

The Bootstrap build uses Bootstrap's stock variables. The only one it changes is `$link-hover-decoration: none`, set in `bootstrap.scss`. The miltonbo theme variables in `miltonbo/scss/bootstrap/_variables.scss` feed `overrides.scss` and the `miltonbo/` partials, but not the Bootstrap build. So changing a colour there does not change Bootstrap's own classes, such as `.btn-primary`.

Prefer a `*.style.ts` file for anything new. The SCSS layer exists for global resets and legacy markup, and it is not theme-aware beyond the `theme-*` class on the root element.

## Checklist for a new page

1. Styles in a sibling `*.style.ts` using `makeStyles` from `tss-react/mui`.
2. Colours from `getThemeColor(state.theme)`, never literals.
3. Verify both themes. Dark is the default, so light is the one people forget.
4. Verify the full 320-1440px range, not just desktop and phone. Tablet widths break most often. Swap in the mobile component if the desktop one does not fit.
5. Sizes, weights and spacing from `@/styles/fonts` and `@/constants`.
