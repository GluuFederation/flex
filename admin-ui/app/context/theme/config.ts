import customColors from '@/customColors'
import { THEME_LIGHT, THEME_DARK, DEFAULT_THEME } from './constants'
import type { FormFooterColors, ThemeConfig } from './types'

export type { FormFooterColors, ThemeConfig }

const createLightTheme = (): ThemeConfig => {
  const background = customColors.lightBackground
  const text = customColors.primaryDark
  const border = customColors.lightBorder

  return {
    background,
    lightBackground: customColors.whiteSmoke,
    fontColor: text,
    textMuted: customColors.textSecondary,
    personalInfoValueColor: customColors.primaryDark,
    personalInfoLabelColor: customColors.primaryDark,
    sectionTitleColor: customColors.primaryDark,
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
    warningColor: customColors.orange,
    badges: {
      statusActiveBg: customColors.statusActiveBg,
      statusActive: customColors.statusActive,
      filledBadgeBg: customColors.statusActive,
      filledBadgeText: customColors.white,
      disabledBg: customColors.disabledBadgeLightBg,
      disabledText: customColors.disabledBadgeLightText,
    },
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
    table: {
      headerText: customColors.tableHeaderTextLight,
      background: customColors.tableRowBgLight,
      rowHoverBg: customColors.lightBackground,
      headerBg: customColors.tableHeaderLight,
      headerColor: customColors.tableHeaderTextLight,
      expandButtonBg: customColors.tableExpandButtonBgLight,
      expandButtonHoverBg: customColors.white,
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
    availableClaims: {
      focusOutline: customColors.lightBlue,
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
    personalInfoValueColor: customColors.white,
    personalInfoLabelColor: customColors.white,
    sectionTitleColor: customColors.white,
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
    warningColor: customColors.orange,
    badges: {
      statusActiveBg: customColors.statusActiveBg,
      statusActive: customColors.statusActive,
      filledBadgeBg: customColors.statusActive,
      filledBadgeText: customColors.white,
      disabledBg: customColors.disabledBadgeDarkBg,
      disabledText: customColors.disabledBadgeDarkText,
    },
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
    table: {
      headerText: customColors.tableHeaderTextDark,
      background: customColors.tableRowBgDark,
      rowHoverBg: customColors.darkDropdownBg,
      headerBg: customColors.tableHeaderBgDark,
      headerColor: customColors.tableHeaderTextDark,
      expandButtonBg: customColors.tableExpandButtonBgDark,
      expandButtonHoverBg: customColors.darkDropdownBg,
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
    availableClaims: {
      focusOutline: customColors.lightBlue,
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
