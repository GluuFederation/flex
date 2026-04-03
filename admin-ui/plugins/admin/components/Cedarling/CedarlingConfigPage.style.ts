import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import {
  BORDER_RADIUS,
  CEDARLING_CONFIG_SPACING,
  MAPPING_SPACING,
  OPACITY,
  SPACING,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import customColors from '@/customColors'
import type { CedarlingConfigPageStyleParams } from './types'

const sectionLabelBase = {
  fontFamily,
  fontWeight: fontWeights.semiBold,
  fontSize: fontSizes.md,
  lineHeight: lineHeights.normal,
  letterSpacing: letterSpacing.normal,
} as const

const useStyles = makeStyles<CedarlingConfigPageStyleParams>()((theme: Theme, params) => {
  const { themeColors, isDark } = params
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formInputBg = themeColors.settings?.formInputBackground ?? themeColors.inputBackground
  const inputBorderColor =
    themeColors.settings?.inputBorder ??
    themeColors.borderColor ??
    (isDark ? customColors.darkBorder : customColors.borderInput)
  const textAsPlaceholder = alpha(themeColors.fontColor, OPACITY.PLACEHOLDER)

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
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    formMain: {
      width: '100%',
      flexGrow: 0,
    },
    formContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    requiredFooterNote: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 6,
      marginTop: theme.spacing(0.5),
      marginBottom: 0,
      paddingLeft: theme.spacing(0.5),
    },
    requiredAsterisk: {
      color: textAsPlaceholder,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      flexShrink: 0,
    },
    requiredNoteText: {
      fontFamily,
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.tight,
      color: textAsPlaceholder,
    },
    alertWrapper: {
      width: '100%',
      marginBottom: CEDARLING_CONFIG_SPACING.ALERT_TO_INPUT,
    },
    alertBox: {
      ...getCardBorderStyle({ isDark, borderRadius: MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS }),
      backgroundColor: cardBg,
      borderRadius: `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
      padding: `${CEDARLING_CONFIG_SPACING.ALERT_PADDING_TOP}px ${CEDARLING_CONFIG_SPACING.ALERT_PADDING_RIGHT}px ${CEDARLING_CONFIG_SPACING.ALERT_PADDING_BOTTOM}px ${CEDARLING_CONFIG_SPACING.ALERT_PADDING_LEFT}px`,
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
    },
    alertIcon: {
      position: 'absolute',
      left: CEDARLING_CONFIG_SPACING.ALERT_ICON_LEFT,
      top: CEDARLING_CONFIG_SPACING.ALERT_ICON_TOP,
      width: CEDARLING_CONFIG_SPACING.ICON_SIZE_MD,
      height: CEDARLING_CONFIG_SPACING.ICON_SIZE_MD,
      color: themeColors.infoAlert.text,
    },
    alertStepTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      color: themeColors.infoAlert.text,
      marginBottom: CEDARLING_CONFIG_SPACING.ALERT_TITLE_MB,
    },
    alertBody: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      color: themeColors.infoAlert.text,
    },
    inputSection: {
      'marginBottom': 0,
      '& .MuiFormHelperText-root': {
        marginLeft: 0,
        paddingLeft: 0,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight,
      },
    },
    uploadBox: {
      'marginTop': theme.spacing(5),
      'marginBottom': theme.spacing(1),
      '& .dropzone': {
        'border': `1px solid ${inputBorderColor}`,
        'backgroundColor': formInputBg,
        'borderRadius': `${MAPPING_SPACING.INFO_ALERT_BORDER_RADIUS}px`,
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        'padding': theme.spacing(2),
        'textAlign': 'center',
        'minHeight': CEDARLING_CONFIG_SPACING.DROPZONE_MIN_HEIGHT,
        'outline': 'none',
        '&:focus': {
          outline: 'none',
        },
        '&:hover': {
          borderColor: inputBorderColor,
          backgroundColor: formInputBg,
        },
      },
      '& .dropzone:has(strong), & .dropzone:has(.gluu-upload-remove)': {
        justifyContent: 'flex-start',
        textAlign: 'left',
      },
      '& .dropzone p': {
        color: textAsPlaceholder,
        margin: 0,
        width: '100%',
        textAlign: 'center',
      },
      '& .dropzone strong': {
        color: themeColors.fontColor,
      },
    },
    fieldLabel: {
      ...sectionLabelBase,
      color: themeColors.fontColor,
      marginBottom: CEDARLING_CONFIG_SPACING.LABEL_MB,
    },
    inputField: {
      '& .MuiOutlinedInput-root': {
        'backgroundColor': formInputBg,
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
            'color': themeColors.fontColor,
            'WebkitTextFillColor': themeColors.fontColor,
            '&::placeholder': {
              color: themeColors.textMuted,
              opacity: OPACITY.PLACEHOLDER,
            },
          },
        },
      },
      '& .MuiInputBase-input': {
        'color': themeColors.fontColor,
        fontFamily,
        'fontSize': fontSizes.base,
        'padding': `${CEDARLING_CONFIG_SPACING.INPUT_PADDING_VERTICAL}px ${CEDARLING_CONFIG_SPACING.INPUT_PADDING_HORIZONTAL}px`,
        '&::placeholder': {
          color: themeColors.textMuted,
          opacity: OPACITY.PLACEHOLDER,
        },
      },
    },
    radioSection: {
      marginBottom: CEDARLING_CONFIG_SPACING.HELPER_MT,
    },
    radioLabel: {
      ...sectionLabelBase,
      color: themeColors.fontColor,
      marginBottom: CEDARLING_CONFIG_SPACING.RADIO_LABEL_MB,
    },
    radio: {
      'color': themeColors.fontColor,
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
      alignItems: 'center',
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
      maxWidth: CEDARLING_CONFIG_SPACING.TOOLTIP_MAX_WIDTH,
    },
    inputFieldWrapper: {
      display: 'block',
      flex: 1,
      minWidth: 0,
    },
    radioGroup: {
      gap: `${CEDARLING_CONFIG_SPACING.RADIO_GROUP_GAP}px`,
    },
    refreshIconButton: {
      'marginTop': 0,
      'color': customColors.logo,
      '&:hover': {
        backgroundColor: alpha(customColors.logo, 0.08),
      },
    },
    alertLink: {
      'fontWeight': fontWeights.medium,
      'color': themeColors.fontColor,
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
