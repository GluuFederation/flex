import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import customColors from '@/customColors'

interface CedarlingConfigThemeColors {
  cardBg: string
  navbarBorder: string
  text: string
  alertText: string
  infoBg: string
  infoBorder: string
  inputBg: string
  placeholderText: string
}

const sectionLabelBase = {
  fontFamily,
  fontWeight: fontWeights.semiBold,
  fontSize: fontSizes.md,
  lineHeight: lineHeights.normal,
  letterSpacing: letterSpacing.normal,
} as const

const useStyles = makeStyles<{ themeColors: CedarlingConfigThemeColors; isDark: boolean }>()((
  theme: Theme,
  params,
) => {
  const { themeColors, isDark } = params

  return {
    configCard: {
      backgroundColor: 'transparent',
      padding: 0,
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
    },
    formContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    alertWrapper: {
      width: '100%',
      marginBottom: CEDARLING_CONFIG_SPACING.ALERT_TO_INPUT,
    },
    alertBox: {
      backgroundColor: themeColors.infoBg,
      border: `1px solid ${themeColors.infoBorder}`,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${CEDARLING_CONFIG_SPACING.ALERT_PADDING_TOP}px ${CEDARLING_CONFIG_SPACING.ALERT_PADDING_RIGHT}px ${CEDARLING_CONFIG_SPACING.ALERT_PADDING_BOTTOM}px ${CEDARLING_CONFIG_SPACING.ALERT_PADDING_LEFT}px`,
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
    },
    alertIcon: {
      position: 'absolute',
      left: CEDARLING_CONFIG_SPACING.ALERT_ICON_LEFT,
      top: CEDARLING_CONFIG_SPACING.ALERT_ICON_TOP,
      width: 24,
      height: 24,
      color: themeColors.alertText,
    },
    alertStepTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      color: themeColors.alertText,
      marginBottom: 8,
    },
    alertBody: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      color: themeColors.alertText,
    },
    inputSection: {
      'marginBottom': CEDARLING_CONFIG_SPACING.INPUT_TO_RADIO,
      '& .MuiFormHelperText-root': {
        marginLeft: 0,
        paddingLeft: 0,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight,
      },
    },
    fieldLabel: {
      ...sectionLabelBase,
      color: themeColors.text,
      marginBottom: CEDARLING_CONFIG_SPACING.LABEL_MB,
    },
    inputField: {
      '& .MuiOutlinedInput-root': {
        'backgroundColor': themeColors.inputBg,
        'borderRadius': BORDER_RADIUS.SMALL,
        'height': CEDARLING_CONFIG_SPACING.INPUT_HEIGHT,
        '& fieldset': {
          borderColor: isDark ? 'transparent' : customColors.borderInput,
        },
        '&:hover fieldset': {
          borderColor: isDark ? 'transparent' : customColors.lightGray,
        },
        '&.Mui-focused fieldset': {
          borderColor: customColors.lightBlue,
        },
        '&.Mui-disabled': {
          '& .MuiInputBase-input': {
            'color': themeColors.text,
            'WebkitTextFillColor': themeColors.text,
            '&::placeholder': {
              color: themeColors.placeholderText,
              opacity: 0.6,
            },
          },
        },
      },
      '& .MuiInputBase-input': {
        'color': themeColors.text,
        fontFamily,
        'fontSize': fontSizes.base,
        'padding': '14px 21px',
        '&::placeholder': {
          color: themeColors.placeholderText,
          opacity: 0.6,
        },
      },
    },
    radioSection: {
      marginBottom: CEDARLING_CONFIG_SPACING.HELPER_MT,
    },
    radioLabel: {
      ...sectionLabelBase,
      color: themeColors.text,
      marginBottom: CEDARLING_CONFIG_SPACING.RADIO_LABEL_MB,
    },
    radio: {
      'color': themeColors.text,
      '&.Mui-checked': {
        'color': customColors.statusActive,
        '& .MuiSvgIcon-root': {
          fill: customColors.statusActive,
          stroke: customColors.statusActive,
          strokeWidth: '1px',
        },
      },
    },
    radioText: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.relaxed,
      color: isDark ? customColors.cedarTextSecondaryDark : customColors.textSecondary,
    },
    helperText: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      color: isDark ? customColors.cedarTextSecondaryDark : customColors.cedarInfoTextLight,
      marginTop: CEDARLING_CONFIG_SPACING.HELPER_MT,
    },
    inputHelperText: {
      marginLeft: 0,
      paddingLeft: 0,
    },
    fieldRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: SPACING.CARD_CONTENT_GAP,
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
      },
    },
    disabledPolicyTooltip: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      maxWidth: 320,
    },
    disabledUrlSpan: {
      cursor: 'not-allowed',
      display: 'block',
      flex: 1,
      minWidth: 0,
      pointerEvents: 'none',
    },
    inputFieldFlex: {
      flex: 1,
    },
    radioGroup: {
      gap: '25px',
    },
    refreshIconButton: {
      'marginTop': 4,
      'color': customColors.logo,
      '&:hover': {
        backgroundColor: `${customColors.logo}14`,
      },
    },
    alertLink: {
      'fontWeight': fontWeights.medium,
      'color': themeColors.text,
      'textDecoration': 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    buttonSection: {
      marginTop: CEDARLING_CONFIG_SPACING.BUTTONS_MT,
    },
  }
})

export { useStyles }
