import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily } from '@/styles/fonts'
import customColors from '@/customColors'

const useStylesBase = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({
    isDark,
    borderRadius: BORDER_RADIUS.DEFAULT,
  })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    page: {
      fontFamily,
      paddingTop: 24,
    },
    cellFileName: {
      color: themeColors.fontColor,
      fontWeight: 500,
    },
    cellDescription: {
      wordBreak: 'break-word',
      maxWidth: '350px',
      fontFamily,
      color: themeColors.fontColor,
    },
    cellDate: {
      fontFamily,
      color: themeColors.fontColor,
    },
    statusBadge: {
      minWidth: 80,
    },
    editIcon: {
      fontSize: 18,
    },
    addIcon: {
      fontSize: 20,
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
      'marginTop': 24,
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': `${SPACING.CARD_PADDING}px`,
      'position': 'relative',
      'overflowX': 'auto',
      'overflowY': 'visible',
      'boxSizing': 'border-box',
      '& table': {
        minWidth: 0,
      },
      '& table td': {
        verticalAlign: 'middle',
        minWidth: 0,
        lineHeight: '28px',
      },
      '& table th': {
        verticalAlign: 'middle',
        lineHeight: '28px',
      },
    },
  }
})

export function useStyles(params: { isDark: boolean; themeColors: ThemeConfig }) {
  const { classes } = useStylesBase(params)
  const { isDark } = params

  const badgeStyles = useMemo(
    () => ({
      statusBadgeEnabled: {
        backgroundColor: customColors.statusActive,
        textColor: customColors.white,
        borderColor: 'transparent',
      },
      statusBadgeDisabled: {
        backgroundColor: isDark
          ? customColors.disabledBadgeDarkBg
          : customColors.disabledBadgeLightBg,
        textColor: isDark
          ? customColors.disabledBadgeDarkText
          : customColors.disabledBadgeLightText,
        borderColor: 'transparent',
      },
    }),
    [isDark],
  )

  return { classes, badgeStyles }
}
