import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { CEDARLING_CONFIG_SPACING, MAPPING_SPACING, BORDER_RADIUS, SPACING } from '@/constants'
import { fontFamily, fontSizes, fontWeights, letterSpacing, lineHeights } from '@/styles/fonts'

interface UserFormStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<UserFormStylesParams>()((_, { isDark, themeColors }) => {
  const settings = themeColors.settings
  const inputBorderColor = settings?.inputBorder ?? themeColors.borderColor
  const inputBg = settings?.cardBackground ?? themeColors.card.background

  return {
    formRoot: {
      fontFamily,
      'display': 'flex',
      'alignItems': 'stretch',
      'flexWrap': 'wrap' as const,

      '& > [class*="col-"]': {
        display: 'flex',
        flexDirection: 'column',
      },

      '& label, & label h5, & label span, & label .MuiSvgIcon-root, & h5': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: `${fontFamily} !important`,
        fontSize: `${fontSizes.base} !important`,
        fontStyle: 'normal !important',
        fontWeight: `${fontWeights.semiBold} !important`,
        lineHeight: 'normal !important',
        letterSpacing: `${letterSpacing.normal} !important`,
        margin: '0 !important',
      },

      '& input::placeholder, & textarea::placeholder': {
        color: `${themeColors.textMuted} !important`,
      },

      '& input:not(.MuiOutlinedInput-input), & select, & textarea, & .custom-select': {
        backgroundColor: `${inputBg} !important`,
        border: `1px solid ${inputBorderColor} !important`,
        borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS,
        color: `${themeColors.fontColor} !important`,
        caretColor: themeColors.fontColor,
        minHeight: CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        height: 'auto',
        paddingTop: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingBottom: CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL,
        paddingLeft: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
        paddingRight: CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL,
      },

      '& select, & .custom-select': {
        paddingRight: 44,
      },

      '& input:focus, & input:active, & select:focus, & select:active, & textarea:focus, & textarea:active, & .custom-select:focus, & .custom-select:active, & .form-control:focus, & .form-control:active':
        {
          backgroundColor: `${inputBg} !important`,
          color: `${themeColors.fontColor} !important`,
          border: `1px solid ${inputBorderColor} !important`,
          outline: 'none !important',
          boxShadow: 'none !important',
        },

      '& input:disabled, & select:disabled, & textarea:disabled, & .custom-select:disabled': {
        opacity: 1,
        cursor: 'not-allowed',
      },

      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0 100px ${inputBg} inset !important`,
          WebkitTextFillColor: `${themeColors.fontColor} !important`,
          color: `${themeColors.fontColor} !important`,
          backgroundColor: `${inputBg} !important`,
          transition: 'background-color 5000s ease-in-out 0s',
        },
    },

    leftStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_CONTENT_GAP,
      minWidth: 0,
      flex: 1,
    },
    sectionCard: {
      /* Match Available Claims panel: lighter blue in dark, background in light */
      backgroundColor: isDark ? themeColors.inputBackground : themeColors.background,
      border: isDark ? 'none' : `1px solid ${themeColors.borderColor}`,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: 20,
      boxSizing: 'border-box',
    },
    fieldsGrid: {
      'display': 'grid',
      'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))',
      'columnGap': SPACING.SECTION_GAP,
      'rowGap': SPACING.CARD_CONTENT_GAP,
      '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
      },
    },
    fullRow: {
      gridColumn: '1 / -1',
    },
    claimsPanelWrap: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    changePasswordRow: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 24,
    },
    dynamicClaimsWrap: {
      marginTop: SPACING.CARD_CONTENT_GAP,
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_CONTENT_GAP,
    },
    changePasswordButton: {
      display: 'inline-flex',
      height: 52,
      padding: '20px 28px',
      justifyContent: 'center',
      alignItems: 'center',
      color: themeColors.fontColor,
      fontFamily,
      fontSize: fontSizes.base,
      fontStyle: 'normal',
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.button,
    },
  }
})
