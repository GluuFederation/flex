import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontSizes, lineHeights } from '@/styles/fonts'

type SsaListPageStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<SsaListPageStylesParams>()((_, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({
    isDark,
    borderRadius: BORDER_RADIUS.DEFAULT,
  })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    page: {
      fontFamily,
      paddingTop: SPACING.PAGE,
    },
    searchCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.CARD_PADDING}px 20px`,
      marginBottom: `${SPACING.CARD_GAP}px`,
      position: 'relative',
      zIndex: 0,
      overflow: 'visible',
      boxSizing: 'border-box',
    },
    searchCardContent: {
      position: 'relative',
      zIndex: 2,
      isolation: 'isolate',
      pointerEvents: 'auto',
    },
    tableCard: {
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'marginTop': SPACING.SECTION_GAP,
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': `${SPACING.CARD_PADDING}px`,
      'position': 'relative',
      'overflow': 'visible',
      'boxSizing': 'border-box',
      '& table': {
        minWidth: 0,
      },
      '& table td': {
        verticalAlign: 'middle',
        minWidth: 0,
        lineHeight: lineHeights.relaxed,
      },
      '& table th': {
        verticalAlign: 'middle',
        lineHeight: lineHeights.relaxed,
      },
    },
    actionIcon: {
      fontSize: fontSizes.content,
    },
    addIcon: {
      fontSize: fontSizes.lg,
    },
    statusBadge: {
      minWidth: 80,
    },
    filledBadge: {
      backgroundColor: `${themeColors.badges.filledBadgeBg} !important`,
      color: `${themeColors.badges.filledBadgeText} !important`,
      border: '1px solid transparent !important',
    },
    disabledBadge: {
      backgroundColor: `${themeColors.background} !important`,
      color: `${themeColors.fontColor} !important`,
      border: `1px solid ${themeColors.borderColor} !important`,
    },
    subtleActiveBadge: {
      backgroundColor: `${themeColors.badges.statusActiveBg} !important`,
      color: `${themeColors.badges.statusActive} !important`,
      border: `1px solid ${themeColors.badges.statusActiveBg} !important`,
    },
  }
})
