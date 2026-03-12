import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'

interface StylesParams {
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
      color: themeColors.errorColor,
    },
    fieldInput: {
      'width': '100%',
      'backgroundColor': themeColors.inputBackground,
      'border': `1px solid ${inputBorderColor}`,
      'borderRadius': MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
      'minHeight': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
      'padding': `${CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL}px ${CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL}px`,
      'boxSizing': 'border-box',
      fontFamily,
      'fontSize': fontSizes.base,
      'color': themeColors.fontColor,
      'caretColor': themeColors.fontColor,
      'outline': 'none',
      '&::placeholder': {
        color: themeColors.textMuted,
        opacity: 1,
      },
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
        backgroundColor: themeColors.inputBackground,
        color: themeColors.fontColor,
      },
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0 100px ${themeColors.inputBackground} inset !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          caretColor: themeColors.fontColor,
          transition: 'background-color 5000s ease-in-out 0s',
        },
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
