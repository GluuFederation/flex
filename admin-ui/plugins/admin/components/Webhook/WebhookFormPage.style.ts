import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights, letterSpacing } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { themeConfig } from '@/context/theme/config'
import customColors from '@/customColors'

type ThemeColors = (typeof themeConfig)[keyof typeof themeConfig]

interface WebhookFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeColors
}

export const useStyles = makeStyles<WebhookFormPageStylesParams>()((
  theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const settings = themeColors.settings
  const infoBg = themeColors.infoAlert?.background ?? customColors.cedarInfoBgLight
  const infoBorder = themeColors.infoAlert?.border ?? customColors.cedarInfoBorderLight
  const infoText = themeColors.infoAlert?.text ?? customColors.cedarInfoTextLight

  return {
    formCard: {
      backgroundColor: settings?.cardBackground ?? themeColors.card.background,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: '100%',
      minHeight: 400,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    header: {
      paddingTop: `${SPACING.CONTENT_PADDING}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      minHeight: 72,
    },
    headerTitle: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
    },
    headerDivider: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      borderBottom: `1px solid ${themeColors.borderColor}`,
      zIndex: 0,
    },
    content: {
      paddingTop: `${SPACING.SECTION_GAP}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: `${SPACING.CONTENT_PADDING}px`,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.SECTION_GAP,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${SPACING.PAGE}px`,
        paddingRight: `${SPACING.PAGE}px`,
      },
    },
    alertBox: {
      backgroundColor: infoBg,
      border: `1px solid ${infoBorder}`,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      color: infoText,
      width: '100%',
      boxSizing: 'border-box',
    },
    alertIcon: {
      flexShrink: 0,
      color: infoText,
    },
    alertText: {
      fontFamily: fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.relaxed,
      color: infoText,
      margin: 0,
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_GAP,
      width: '100%',
    },
    fieldsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      columnGap: SPACING.CARD_GAP,
      rowGap: SPACING.CARD_GAP,
      width: '100%',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
    headersSection: {
      width: '100%',
      marginTop: 8,
    },
    fieldItem: {
      width: '100%',
    },
    fieldItemFullWidth: {
      width: '100%',
      gridColumn: '1 / -1',
    },
    formLabels: {
      '& label, & label h5, & label .MuiSvgIcon-root': {
        color: `${themeColors.fontColor} !important`,
        fontFamily: fontFamily,
        fontSize: fontSizes.base,
        fontStyle: 'normal',
        fontWeight: fontWeights.semiBold,
        lineHeight: 'normal',
        letterSpacing: letterSpacing.normal,
      },
    },
    formWithInputs: {
      '& input, & select': {
        backgroundColor: settings?.formInputBackground ?? themeColors.inputBackground,
        border: `1px solid ${settings?.inputBorder ?? themeColors.borderColor}`,
        borderRadius: 6,
        color: themeColors.fontColor,
        padding: '8px 12px',
      },
      '& input:disabled': {
        backgroundColor: `${settings?.formInputBackground ?? themeColors.inputBackground} !important`,
        border: `1px solid ${settings?.inputBorder ?? themeColors.borderColor} !important`,
        color: `${themeColors.fontColor} !important`,
        opacity: 1,
        cursor: 'not-allowed',
      },
      '& input::placeholder': {
        color: themeColors.textMuted,
      },
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      width: '100%',
      marginTop: SPACING.SECTION_GAP,
      paddingTop: SPACING.CARD_GAP,
      borderTop: `1px solid ${themeColors.borderColor}`,
    },
  }
})
