type ButtonColor = { backgroundColor: string; textColor: string; borderColor: string }

export type FormFooterColors = {
  back: ButtonColor
  apply: ButtonColor
  cancel: ButtonColor
}

export type ThemeConfig = {
  background: string
  lightBackground: string
  fontColor: string
  textMuted: string
  personalInfoValueColor: string
  personalInfoLabelColor: string
  sectionTitleColor: string
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
  warningColor: string
  badges: {
    statusActiveBg: string
    statusActive: string
    filledBadgeBg: string
    filledBadgeText: string
    disabledBg: string
    disabledText: string
  }
  formFooter: FormFooterColors
  table: {
    headerText: string
    background: string
    rowHoverBg: string
    headerBg: string
    headerColor: string
    expandButtonBg: string
    expandButtonHoverBg: string
  }
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
  availableClaims: {
    focusOutline: string
  }
}
