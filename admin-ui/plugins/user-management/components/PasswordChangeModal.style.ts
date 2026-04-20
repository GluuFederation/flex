import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'
import {
  createFormInputStyles,
  createFormInputFocusStyles,
  createFormInputPlaceholderStyles,
  createFormInputAutofillStyles,
} from '@/styles/formStyles'

type StylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const usePasswordModalStyles = makeStyles<StylesParams>()((
  _theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const inputBorderColor = themeColors.settings?.inputBorder ?? themeColors.borderColor
  const modalBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const inputColors = {
    inputBg: themeColors.inputBackground,
    inputBorderColor,
    fontColor: themeColors.fontColor,
    textMuted: themeColors.textMuted,
  }

  return {
    modalContainer: {
      ...cardBorderStyle,
      position: 'fixed' as const,
      backgroundColor: modalBg,
    },
    fieldsRow: {
      'display': 'grid',
      'gridTemplateColumns': '1fr 1fr',
      'gap': 24,
      '@media (max-width: 700px)': {
        gridTemplateColumns: '1fr',
      },
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    fieldLabel: {
      fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.base,
      lineHeight: 'normal',
      color: themeColors.fontColor,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    fieldRequired: {
      color: themeColors.requiredColor,
    },
    fieldInput: {
      'width': '100%',
      'boxSizing': 'border-box',
      fontFamily,
      'fontSize': fontSizes.base,
      'outline': 'none',
      ...createFormInputStyles(inputColors),
      '&::placeholder': createFormInputPlaceholderStyles(themeColors.textMuted),
      '&:focus, &:focus-visible': createFormInputFocusStyles(inputColors),
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        createFormInputAutofillStyles(inputColors),
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    toggleButton: {
      'position': 'absolute',
      'right': 12,
      'top': '50%',
      'transform': 'translateY(-50%)',
      'background': 'transparent',
      'border': 'none',
      'cursor': 'pointer',
      'padding': 4,
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'color': themeColors.fontColor,
      'opacity': 0.7,
      '&:hover': {
        opacity: 1,
      },
    },
    errorText: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.sm,
      color: themeColors.errorColor,
      margin: 0,
      marginTop: -3,
      minHeight: 18,
    },
  }
})
