import customColors from '@/customColors'

export const themeConfig = {
  darkBlack: {
    background: customColors.darkGray,
    lightBackground: customColors.darkBlueLightBackground,
    fontColor: customColors.darkGray,
    borderColor: customColors.lightGray,
    menu: {
      background: customColors.darkBlueMenuBackground,
      color: customColors.white,
    },
    dashboard: {
      supportCard: customColors.darkGray,
    },
  },
  darkBlue: {
    background: customColors.darkBlueThemeBackground,
    lightBackground: customColors.blueThemelightBackground,
    fontColor: customColors.darkGray,
    borderColor: customColors.lightGray,
    menu: {
      background: customColors.darkBlueThemeBackground,
      color: customColors.white,
    },
    dashboard: {
      supportCard: customColors.blueThemebackground,
    },
  },
  lightBlue: {
    background: customColors.blueThemebackground,
    lightBackground: customColors.blueThemelightBackground,
    fontColor: customColors.darkGray,
    borderColor: customColors.lightGray,
    menu: {
      background: customColors.blueThemebackground,
      color: customColors.white,
    },
    dashboard: {
      supportCard: customColors.darkGray,
    },
  },
  lightGreen: {
    background: customColors.logo,
    lightBackground: customColors.greenThemeLightBackground,
    fontColor: customColors.darkGray,
    borderColor: customColors.lightGray,
    menu: {
      background: customColors.logo,
      color: customColors.white,
    },
    dashboard: {
      supportCard: customColors.darkGray,
    },
  },
}

const getThemeColor = (config: string): (typeof themeConfig)[keyof typeof themeConfig] => {
  return themeConfig[config as keyof typeof themeConfig]
}

export default getThemeColor
