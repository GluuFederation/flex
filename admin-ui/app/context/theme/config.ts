import customColors from '@/customColors'

const createLightTheme = () => {
  const background = customColors.lightBackground
  const text = customColors.primaryDark
  const border = customColors.lightBorder

  return {
    background,
    lightBackground: customColors.whiteSmoke,
    fontColor: text,
    borderColor: border,
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
  light: createLightTheme(),
  dark: createDarkTheme(),
}

const getThemeColor = (config: string): (typeof themeConfig)[keyof typeof themeConfig] => {
  const validConfig = config === 'light' || config === 'dark' ? config : 'light'
  return themeConfig[validConfig]
}

export default getThemeColor
