import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, letterSpacing, lineHeights } from '@/styles/fonts'

interface HealthPageThemeColors {
  cardBg: string
  cardBorder: string
  text: string
  background: string
  refreshButtonBg: string
  refreshButtonBorder: string
  refreshButtonText: string
}

const useStyles = makeStyles<{ themeColors: HealthPageThemeColors; isDark: boolean }>()((
  theme: Theme,
  params,
) => {
  const { themeColors, isDark } = params

  const getCardBorderStyle = () => {
    if (isDark) {
      return {
        border: `1.5px solid ${customColors.darkBorderAccent}`,
      }
    }
    return {
      border: `1px solid ${customColors.lightBorder}`,
      boxShadow: `0px 4px 11px 0px ${customColors.shadowLight}`,
    }
  }

  const cardBorderStyle = getCardBorderStyle()

  return {
    root: {
      maxWidth: '100vw',
      padding: '24px',
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
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      [theme.breakpoints.down('lg')]: {
        width: '100%',
        maxWidth: 1196,
      },
    },
    header: {
      paddingTop: isDark ? '32.5px' : '34px',
      paddingLeft: isDark ? '38.5px' : '40px',
      paddingRight: '40px',
      paddingBottom: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative',
      height: isDark ? '83px' : '84.5px',
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
      left: isDark ? '-1.5px' : '0',
      bottom: 0,
      width: '100%',
      height: '1px',
      backgroundColor: isDark ? customColors.darkBorderAccent : customColors.healthCardBorderLight,
      zIndex: 0,
    },
    refreshButton: {
      'border': `1px solid ${themeColors.refreshButtonBorder}`,
      'borderRadius': 4,
      'height': 44,
      'width': 108,
      'padding': 0,
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'flex-start',
      'position': 'absolute',
      'right': '40px',
      'top': '50%',
      'transform': 'translateY(-50%)',
      'backgroundColor': themeColors.refreshButtonBg,
      'cursor': 'pointer',
      fontFamily,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      'lineHeight': lineHeights.relaxed,
      'color': themeColors.refreshButtonText,
      'transition': 'opacity 0.2s ease',
      'zIndex': 10,
      '&:hover': {
        opacity: 0.8,
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    refreshIcon: {
      position: 'absolute',
      left: '14px',
      top: '10px',
      width: 22,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    refreshButtonText: {
      position: 'absolute',
      left: '40px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    servicesGrid: {
      'paddingTop': isDark ? '31.5px' : '32.5px',
      'paddingLeft': isDark ? '38.5px' : '40px',
      'paddingRight': '40px',
      'paddingBottom': '40px',
      'flex': 1,
      'minHeight': 0,
      'overflowY': 'auto',
      'width': '100%',
      'boxSizing': 'border-box',
      'margin': 0,
      '& > .MuiGrid-item': {
        'paddingTop': '24px',
        'paddingLeft': '0px',
        'paddingRight': '10px',
        '&:nth-of-type(odd)': {
          paddingLeft: '0px',
          paddingRight: '10px',
        },
        '&:nth-of-type(even)': {
          paddingLeft: '10px',
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
