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
