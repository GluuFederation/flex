import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import customColors from '@/customColors'

interface HealthPageThemeColors {
  cardBg: string
  navbarBorder: string
  text: string
  refreshButtonBg: string
  refreshButtonBorder: string
  refreshButtonText: string
}

const useStyles = makeStyles<{ themeColors: HealthPageThemeColors; isDark: boolean }>()((
  theme: Theme,
  params,
) => {
  const { themeColors, isDark } = params

  const cardBorderStyle = getCardBorderStyle({
    isDark,
  })

  return {
    healthCard: {
      backgroundColor: themeColors.cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: 0,
      width: '100%',
      minHeight: 616,
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
      paddingBottom: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative',
      height: '84.5px',
    },
    headerTitle: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      margin: 0,
    },
    headerDivider: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      borderBottom: `1px solid ${themeColors.navbarBorder}`,
      zIndex: 0,
    },
    refreshButtonWrapper: {
      position: 'absolute',
      right: `${SPACING.CONTENT_PADDING}px`,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
    },
    refreshButton: {
      'border': `1px solid ${themeColors.refreshButtonBorder}`,
      'borderRadius': 4,
      'height': 44,
      'width': 108,
      'padding': '0 14px',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'flex-start',
      'gap': 8,
      'backgroundColor': themeColors.refreshButtonBg,
      'cursor': 'pointer',
      fontFamily,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      'lineHeight': lineHeights.relaxed,
      'color': themeColors.refreshButtonText,
      'transition': 'opacity 0.2s ease',
      '&:hover': {
        opacity: 0.8,
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    messageBlock: {
      padding: `${SPACING.CONTENT_PADDING}px`,
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.CARD_CONTENT_GAP,
    },
    errorMessage: {
      color: customColors.accentRed,
    },
    infoMessage: {
      color: customColors.textSecondary,
    },
    errorIcon: {
      color: 'inherit',
      flexShrink: 0,
    },
    infoIcon: {
      color: 'inherit',
      flexShrink: 0,
    },
    servicesGrid: {
      paddingTop: `${SPACING.SECTION_GAP}px`,
      paddingLeft: `${SPACING.CONTENT_PADDING}px`,
      paddingRight: `${SPACING.CONTENT_PADDING}px`,
      paddingBottom: `${SPACING.CONTENT_PADDING}px`,
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      width: '100%',
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: SPACING.CARD_GAP,
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
    },
    serviceCardWrapper: {
      minWidth: 0,
    },
    refreshIcon: {
      fontSize: 16,
    },
  }
})

export { useStyles }
