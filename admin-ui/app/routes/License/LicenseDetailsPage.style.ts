import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface StylesParams {
  themeColors: ThemeConfig
  isDark: boolean
}

export const useStyles = makeStyles<StylesParams>()((theme, { themeColors, isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })

  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    licenseCard: {
      backgroundColor: cardBg,
      borderRadius: '16px',
      padding: `${SPACING.CONTENT_PADDING}px`,
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      ...cardBorderStyle,
    },
    licenseContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: `${SPACING.CARD_GAP}px`,
      [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
    },
    fieldWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: `${SPACING.CARD_CONTENT_GAP}px`,
    },
    label: {
      fontFamily,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.loose,
      color: themeColors.textMuted,
      margin: 0,
      padding: 0,
    },
    value: {
      fontFamily,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.loose,
      color: themeColors.fontColor,
      margin: 0,
      padding: 0,
    },
    buttonContainer: {
      marginTop: `${SPACING.CARD_GAP}px`,
      display: 'flex',
      justifyContent: 'flex-start',
    },
    resetButton: {
      gap: `${SPACING.CARD_CONTENT_GAP}px`,
      minWidth: 130,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: '16px',
      border: `1px solid ${themeColors.card.border}`,
      boxShadow: 'none',
      padding: 0,
    },
    cardBody: {
      padding: '15px',
    },
  }
})
