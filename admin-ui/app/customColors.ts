// Custom Project Colors
// Define all your custom colors here for easy maintenance

export const customColors = {
  logo: '#00b875',
  darkGray: '#323c47',
  accentRed: '#b3424a',
  lightBlue: '#3573a6',
  lightCyan: '#bdd4d5',
  lightGray: '#eaecf1',
  paleYellow: '#cfd76f',
  mutedTeal: '#669da2',
  mint: '#bee0d2',
  lightGreen: '#7bc257',
  orange: '#ff993a',
  white: '#ffffff',
  black: '#000000',
  whiteSmoke: '#f5f5f5',
  greenThemeLightBackground: '#abebd4',
  blueThemelightBackground: '#c9def6',
  blueThemebackground: '#9DBDE2',
  darkBlueThemeBackground: '#284461',
  darkBlueMenuBackground: '#323C46',
  darkBlueLightBackground: '#989ea7',
} as const

export type CustomColorKeys = keyof typeof customColors

export default customColors
