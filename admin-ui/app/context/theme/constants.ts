export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
export const DEFAULT_THEME = THEME_LIGHT

export const THEME_VALUES = [THEME_LIGHT, THEME_DARK] as const

export type ThemeValue = typeof THEME_LIGHT | typeof THEME_DARK

export function isValidTheme(value: string): value is ThemeValue {
  return THEME_VALUES.includes(value as ThemeValue)
}
