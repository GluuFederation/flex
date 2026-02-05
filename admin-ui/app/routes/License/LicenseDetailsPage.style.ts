import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { SPACING } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface StylesParams {
  isDark: boolean
}

export const useStyles = makeStyles<StylesParams>()((theme, { isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })

  return {
    licenseCard: {
      backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
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
      color: isDark ? customColors.textMutedDark : customColors.textSecondary,
      margin: 0,
      padding: 0,
    },
    value: {
      fontFamily,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.loose,
      color: isDark ? customColors.white : customColors.primaryDark,
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
    },
    refreshIcon: {
      fontSize: fontSizes.md,
    },
    card: {
      backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
      borderRadius: '16px',
      border: isDark ? `1.5px solid ${customColors.darkBorder}` : 'none',
      boxShadow: isDark ? 'none' : `0px 4px 11px 0px ${customColors.black}`,
      padding: 0,
    },
    cardBody: {
      padding: '15px',
    },
  }
})
