import customColors from '@/customColors'
import { THEME_LIGHT, THEME_DARK, DEFAULT_THEME } from './constants'

export interface FormFooterColors {
  back: { backgroundColor: string; textColor: string; borderColor: string }
  apply: { backgroundColor: string; textColor: string; borderColor: string }
  cancel: { backgroundColor: string; textColor: string; borderColor: string }
}

export interface ThemeConfig {
  background: string
  lightBackground: string
  fontColor: string
  textMuted: string
  borderColor: string
  inputBackground: string
  menu: { background: string; color: string }
  navbar: { background: string; border: string; text: string; icon: string }
  dashboard: { supportCard: string }
  card: { background: string; border: string }
  infoAlert: {
    background: string
    border: string
    text: string
    icon: string
  }
  checkbox: { uncheckedBorder: string }
  errorColor: string
  formFooter: FormFooterColors
  settings: {
    cardBackground: string
    customParamsBox: string
    customParamsInput: string
    formInputBackground: string
    inputBorder: string
    addPropertyButton: { bg: string; text: string }
    removeButton: { bg: string; text: string }
    errorButtonText: string
  }
}

const createLightTheme = (): ThemeConfig => {
  const background = customColors.lightBackground
  const text = customColors.primaryDark
  const border = customColors.lightBorder

  return {
    background,
    lightBackground: customColors.whiteSmoke,
    fontColor: text,
    textMuted: customColors.textSecondary,
    borderColor: border,
    inputBackground: customColors.lightInputBg,
    menu: {
      background: customColors.white,
      color: text,
    },
    navbar: {
      background,
      border,
      text,
      icon: customColors.textSecondary,
    },
    dashboard: {
      supportCard: customColors.white,
    },
    card: {
      background: customColors.white,
      border: customColors.lightBorder,
    },
    infoAlert: {
      background: customColors.cedarInfoBgLight,
      border: customColors.cedarInfoBorderLight,
      text: customColors.cedarInfoTextLight,
      icon: customColors.cedarInfoTextLight,
    },
    checkbox: {
      uncheckedBorder: customColors.sidebarHoverBg,
    },
    errorColor: customColors.accentRed,
    formFooter: {
      back: {
        backgroundColor: customColors.statusActive,
        textColor: customColors.white,
        borderColor: customColors.statusActive,
      },
      apply: {
        backgroundColor: customColors.primaryDark,
        textColor: customColors.white,
        borderColor: customColors.primaryDark,
      },
      cancel: {
        backgroundColor: 'transparent',
        textColor: customColors.primaryDark,
        borderColor: customColors.primaryDark,
      },
    },
    settings: {
      cardBackground: customColors.white,
      customParamsBox: customColors.whiteSmoke,
      customParamsInput: customColors.white,
      formInputBackground: customColors.whiteSmoke,
      inputBorder: customColors.borderInput,
      addPropertyButton: { bg: customColors.primaryDark, text: customColors.white },
      removeButton: { bg: customColors.statusInactive, text: customColors.white },
      errorButtonText: customColors.white,
    },
  }
}

const createDarkTheme = (): ThemeConfig => {
  const background = customColors.darkBackground
  const text = customColors.white
  const border = customColors.darkBorder

  return {
    background,
    lightBackground: customColors.primaryDark,
    fontColor: text,
    textMuted: customColors.textMutedDark,
    borderColor: border,
    inputBackground: customColors.darkInputBg,
    menu: {
      background: customColors.primaryDark,
      color: text,
    },
    navbar: {
      background,
      border,
      text,
      icon: text,
    },
    dashboard: {
      supportCard: customColors.darkCardBg,
    },
    card: {
      background: customColors.cedarCardBgDark,
      border: customColors.cedarCardBorderDark,
    },
    infoAlert: {
      background: customColors.cedarCardBgDark,
      border: customColors.cedarCardBorderDark,
      text: customColors.cedarTextSecondaryDark,
      icon: customColors.cedarTextTertiaryDark,
    },
    checkbox: {
      uncheckedBorder: customColors.cedarCardBorderDark,
    },
    errorColor: customColors.accentRed,
    formFooter: {
      back: {
        backgroundColor: customColors.statusActive,
        textColor: customColors.white,
        borderColor: customColors.statusActive,
      },
      apply: {
        backgroundColor: customColors.white,
        textColor: customColors.primaryDark,
        borderColor: customColors.white,
      },
      cancel: {
        backgroundColor: 'transparent',
        textColor: customColors.white,
        borderColor: customColors.white,
      },
    },
    settings: {
      cardBackground: customColors.darkCardBg,
      customParamsBox: customColors.darkCardBg,
      customParamsInput: customColors.darkInputBg,
      formInputBackground: customColors.darkInputBg,
      inputBorder: customColors.darkBorder,
      addPropertyButton: { bg: customColors.white, text: customColors.addPropertyTextDark },
      removeButton: { bg: customColors.statusInactive, text: customColors.white },
      errorButtonText: customColors.white,
    },
  }
}

export const themeConfig = {
  [THEME_LIGHT]: createLightTheme(),
  [THEME_DARK]: createDarkTheme(),
}

const getThemeColor = (config: string): ThemeConfig => {
  const validConfig = config === THEME_LIGHT || config === THEME_DARK ? config : DEFAULT_THEME
  return themeConfig[validConfig]
}

export default getThemeColor
