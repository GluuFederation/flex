export const customColors = {
  logo: '#00b875',
  darkGray: '#323c47',
  accentRed: '#b3424a',
  lightBlue: '#3573a6',
  lightGray: '#eaecf1',
  paleYellow: '#cfd76f',
  lightGreen: '#7bc257',
  orange: '#ff993a',
  white: '#ffffff',
  black: '#000000',
  whiteSmoke: '#f5f5f5',

  lightBackground: '#f6f6f6',
  primaryDark: '#0a2540',
  lightBorder: '#efefef',
  darkBackground: '#0b2947',
  darkSidebar: '#0a2540',
  darkBorder: '#193f66',
  darkCardBg: '#091e34',
  darkDropdownBg: '#194169',
  textSecondary: '#425466',
  mauDark: '#4CAF50',
  mauPieClientCredentials: '#64b5f6',
  mauPieAuthCodeAccess: '#ffb74d',
  mauTrendClientCredentials: '#5daafa',
  mauTrendAuthCodeAccess: '#f9aa35',
  mauTrendAuthCodeId: '#da51f0',
  statusActive: '#00a65d',
  statusActiveBg: '#d3f5e6',
  statusInactive: '#f13f44',
  statusInactiveBg: '#ffe6e7',
  borderInput: '#ebebeb',
  darkInputBg: '#15395d',
  lightInputBg: '#f9fafb',
  sidebarHoverBg: '#d3d3d3',
  textMutedDark: '#6a8096',
  chartPurple: '#8979ff',
  chartCoral: '#ff928a',
  chartCyan: '#3cc3df',
  buttonLightBg: '#f4f6f8',
  darkBorderGradientBase: '#00d5e6',
  ribbonShadowRgb: '#1a237e',
} as const

export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`)
  }
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  return `${r}, ${g}, ${b}`
}

export type CustomColorKeys = keyof typeof customColors

export default customColors
