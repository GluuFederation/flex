import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { BORDER_RADIUS } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface MauThemeColors {
  cardBg: string
  text: string
}

interface MauStylesParams {
  themeColors: MauThemeColors
  isDark: boolean
}

export const useMauStyles = makeStyles<MauStylesParams>()((
  theme: Theme,
  { themeColors, isDark },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })

  return {
    summary: {
      height: 120,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: '20px 28px',
      backgroundColor: themeColors.cardBg,
      boxSizing: 'border-box',
    },
    summaryText: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      marginBottom: 20,
    },
    summaryValue: {
      fontFamily,
      color: themeColors.text,
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.tight,
    },
    trendCard: {
      width: '100%',
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: '24px 28px',
      backgroundColor: themeColors.cardBg,
      boxSizing: 'border-box',
    },
    trendTitle: {
      fontFamily,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
      color: themeColors.text,
      marginTop: 0,
      marginBottom: 16,
    },
  }
})
