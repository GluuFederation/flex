export const customColors = {
  // Base
  white: '#ffffff',
  black: '#000000',
  whiteSmoke: '#f5f5f5',
  lightGray: '#eaecf1',
  darkGray: '#323c47',

  // Backgrounds
  lightBackground: '#f6f6f6',
  primaryDark: '#0a2540',
  darkBackground: '#0b2947',
  darkCardBg: '#091e34',
  darkDropdownBg: '#194169',
  lightInputBg: '#f9fafb',
  darkInputBg: '#15395d',

  // Borders
  lightBorder: '#efefef',
  darkBorder: '#193f66',
  borderInput: '#ebebeb',

  // Text
  textSecondary: '#425466',
  textMutedDark: '#6a8096',

  // Brand / accent
  logo: '#00b875',
  accentRed: '#b3424a',
  lightBlue: '#3573a6',
  lightGreen: '#7bc257',
  orange: '#ff993a',
  paleYellow: '#cfd76f',

  // Status
  statusActive: '#00a65d',
  statusActiveBg: '#d3f5e6',
  statusInactive: '#f13f44',
  statusInactiveBg: '#ffe6e7',

  // Disabled Badge
  disabledBadgeLightBg: '#D9E1E8',
  disabledBadgeLightText: '#425466',
  disabledBadgeDarkBg: '#13385D',
  disabledBadgeDarkText: '#90B5D9',

  // Settings / custom params
  addPropertyTextDark: '#1A2F45',
  customParamsBoxDark: '#1E3650',
  customParamsInputDark: '#1B2F45',

  // UI elements
  sidebarHoverBg: '#d3d3d3',
  buttonLightBg: '#f4f6f8',

  // Charts
  mauPieClientCredentials: '#64b5f6',
  mauPieAuthCodeAccess: '#ffb74d',
  mauTrendClientCredentials: '#5daafa',
  mauTrendAuthCodeAccess: '#f9aa35',
  mauTrendAuthCodeId: '#da51f0',
  chartPurple: '#8979ff',
  chartCoral: '#ff928a',
  chartCyan: '#3cc3df',

  // Table
  tableHeaderTextLight: '#4F6377',
  tableHeaderTextDark: '#88AFD7',
  tableRowBgDark: '#091e34',
  tableRowBgLight: '#FFFFFF',
  tableHeaderBgDark: '#0b2947',
  tableHeaderLight: '#F4F6F8',
  tableExpandButtonBgLight: '#F4F6F8',
  tableExpandButtonBgDark: '#0B2947',

  // Cedar
  cedarCardBgDark: '#10375e',
  cedarCardBorderDark: '#224f7c',
  cedarTextSecondaryDark: '#c9dbec',
  cedarTextTertiaryDark: '#72a1d1',
  cedarInfoBgLight: '#e5f6fd',
  cedarInfoBorderLight: '#a6d3e6',
  cedarInfoTextLight: '#4f8196',

  // Other
  darkBorderGradientBase: '#00d5e6',
  ribbonShadowColor: '#1a237e',
} as const

export const hexToRgb = (hex: string, fallback: string = '0, 0, 0'): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return fallback
  }
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  return `${r}, ${g}, ${b}`
}

export const getLoadingOverlayRgba = (hexColor: string, opacity: number): string =>
  `rgba(${hexToRgb(hexColor)}, ${opacity})`

export type CustomColorKeys = keyof typeof customColors

/** Convert camelCase to kebab-case for CSS variable names */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/** CSS custom properties from customColors; also --custom-*-rgb for rgba(var(--custom-*-rgb), opacity) in SCSS. */
export function getCustomColorsAsCssVars(): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(customColors)) {
    const kebab = toKebabCase(key)
    vars[`--custom-${kebab}`] = value
    vars[`--custom-${kebab}-rgb`] = hexToRgb(value)
  }
  return vars
}

export default customColors
