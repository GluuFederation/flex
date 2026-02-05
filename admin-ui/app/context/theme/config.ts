import customColors from '@/customColors'
import { THEME_LIGHT, THEME_DARK, DEFAULT_THEME } from './constants'

const createLightTheme = () => {
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
  }
}

const createDarkTheme = () => {
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
  }
}

export const themeConfig = {
  [THEME_LIGHT]: createLightTheme(),
  [THEME_DARK]: createDarkTheme(),
}

const getThemeColor = (config: string): (typeof themeConfig)[keyof typeof themeConfig] => {
  const validConfig = config === THEME_LIGHT || config === THEME_DARK ? config : DEFAULT_THEME
  return themeConfig[validConfig]
}

export default getThemeColor
