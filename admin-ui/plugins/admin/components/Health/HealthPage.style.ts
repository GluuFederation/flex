import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

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
    root: {
      maxWidth: '100vw',
      padding: '24px 0',
      display: 'flex',
      justifyContent: 'center',
    },
    wrapper: {
      width: '100%',
      maxWidth: 1196,
      display: 'flex',
      justifyContent: 'center',
    },
    healthCard: {
      backgroundColor: themeColors.cardBg,
      ...cardBorderStyle,
      borderRadius: 16,
      padding: 0,
      width: 1196,
      height: 616,
      position: 'relative',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      [theme.breakpoints.down('lg')]: {
        width: '100%',
        maxWidth: 1196,
      },
    },
    header: {
      paddingTop: '24px',
      paddingLeft: '24px',
      paddingRight: '24px',
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
      right: '24px',
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
    servicesGrid: {
      'paddingTop': '24px',
      'paddingLeft': '24px',
      'paddingRight': '24px',
      'paddingBottom': '24px',
      'flex': 1,
      'minHeight': 0,
      'overflowY': 'auto',
      'width': '100%',
      'boxSizing': 'border-box',
      'margin': 0,
      '& > .MuiGrid-item': {
        'paddingTop': '24px',
        'paddingLeft': '0px',
        'paddingRight': '12px',
        '&:nth-of-type(odd)': {
          paddingLeft: '0px',
          paddingRight: '12px',
        },
        '&:nth-of-type(even)': {
          paddingLeft: '12px',
          paddingRight: '0px',
        },
        '&:nth-of-type(1), &:nth-of-type(2)': {
          paddingTop: '0px',
        },
      },
    },
  }
})

export { useStyles }
