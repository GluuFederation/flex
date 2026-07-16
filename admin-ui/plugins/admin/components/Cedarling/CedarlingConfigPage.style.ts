import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import {
  CEDARLING_CONFIG_SPACING,
  MAPPING_SPACING,
  OPACITY,
  SPACING,
  MOBILE_MEDIA_QUERY,
  MOBILE_PAGE_PADDING_X,
} from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import customColors from '@/customColors'
import type { CedarlingConfigPageStyleParams } from './types'

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
    mobileContentPad: {
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.MD}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.MD}px`,
        marginTop: `-${SPACING.PAGE / 2}px`,
        boxSizing: 'border-box',
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${MOBILE_PAGE_PADDING_X.SM}px`,
        paddingRight: `${MOBILE_PAGE_PADDING_X.SM}px`,
      },
    },
    mobilePageTitle: {
      display: 'none',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        display: 'block',
        fontFamily,
        fontSize: fontSizes.pageTitle,
        fontStyle: 'normal',
        fontWeight: fontWeights.bold,
        lineHeight: 'normal',
        color: themeColors.fontColor,
        margin: 0,
        marginBottom: SPACING.PAGE,
      },
    },
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
    footer: {
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginTop: 0,
        paddingTop: CEDARLING_CONFIG_SPACING.MOBILE_STEPS_TO_LABEL,
      },
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
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        color: themeColors.fontColor,
      },
    },
    alertWrapper: {
      width: '100%',
      marginBottom: CEDARLING_CONFIG_SPACING.ALERT_TO_INPUT,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginBottom: 0,
      },
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
    uploadBox: {
      'marginTop': theme.spacing(8),
      'marginBottom': theme.spacing(1),
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        'marginTop': CEDARLING_CONFIG_SPACING.MOBILE_STEPS_TO_LABEL,
        'marginLeft': `-${CEDARLING_CONFIG_SPACING.ALERT_PADDING_LEFT - CEDARLING_CONFIG_SPACING.MOBILE_CONTENT_PADDING_LEFT}px`,
        'marginRight': `-${CEDARLING_CONFIG_SPACING.ALERT_PADDING_RIGHT - CEDARLING_CONFIG_SPACING.MOBILE_CONTENT_PADDING_LEFT}px`,
        '& .dropzone': {
          minHeight: CEDARLING_CONFIG_SPACING.MOBILE_DROPZONE_MIN_HEIGHT,
        },
        '& .dropzone, & .dropzone *': {
          cursor: 'not-allowed',
        },
      },
      '& > label': {
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
        marginBottom: '2px !important',
      },
      '& > label h5, & > label h5 span, & > label span': {
        margin: '0 !important',
        lineHeight: `${lineHeights.normal} !important`,
      },
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
        [`@media ${MOBILE_MEDIA_QUERY}`]: {
          fontSize: fontSizes.base,
          lineHeight: lineHeights.tight,
        },
      },
      '& .dropzone strong': {
        color: themeColors.fontColor,
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
  }
})

export { useStyles }
