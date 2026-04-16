import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING, ICON_SIZE, TOOLBAR } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'

const CARD_INNER_PADDING = SPACING.CARD_CONTENT_GAP * 2 + 4
const STATUS_BADGE_MIN_WIDTH = 80
const EXPANDED_GRID_COLUMNS = 4

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
    page: { fontFamily, paddingTop: SPACING.PAGE },

    searchCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.PAGE}px ${CARD_INNER_PADDING}px`,
      marginBottom: `${CARD_INNER_PADDING}px`,
      position: 'relative',
      zIndex: 5,
      overflow: 'visible',
      boxSizing: 'border-box',
    },
    searchCardContent: {
      position: 'relative',
      zIndex: 2,
      isolation: 'isolate',
      pointerEvents: 'auto',
    },
    toolbarRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 10,
      flexWrap: 'wrap' as const,
      width: '100%',
    },
    searchToolbarWrapper: {
      flex: 1,
      minWidth: TOOLBAR.SEARCH_MIN_WIDTH,
      overflow: 'visible',
    },
    actionsGroup: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 10,
      position: 'relative',
      marginLeft: 'auto',
      zIndex: 20,
      pointerEvents: 'auto',
      isolation: 'isolate',
    },
    toolbarButton: {
      minWidth: TOOLBAR.MIN_WIDTH,
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto' as const,
    },

    tableCard: {
      'width': '100%',
      'maxWidth': '100%',
      'minWidth': 0,
      'marginTop': SPACING.PAGE,
      'backgroundColor': cardBg,
      ...cardBorderStyle,
      'borderRadius': BORDER_RADIUS.DEFAULT,
      'padding': `${CARD_INNER_PADDING}px`,
      'position': 'relative',
      'overflow': 'visible',
      'boxSizing': 'border-box',
      '& table td': { verticalAlign: 'middle' },
      '& table th': { verticalAlign: 'middle' },
      '& table': {
        tableLayout: 'auto !important' as 'auto',
        minWidth: '0 !important',
      },
    },

    cellText: {
      color: themeColors.fontColor,
      fontWeight: fontWeights.medium,
      fontFamily,
    },
    statusBadge: { minWidth: STATUS_BADGE_MIN_WIDTH },
    deleteIcon: { fontSize: ICON_SIZE.SM },

    expandedGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${EXPANDED_GRID_COLUMNS}, 1fr)`,
      gap: `${SPACING.SECTION_GAP}px`,
      width: '100%',
      minWidth: 0,
    },
    expandedField: {
      minWidth: 0,
      overflowWrap: 'break-word' as const,
      wordBreak: 'break-word' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
    },
    expandedHalfField: {
      gridColumn: 'span 2',
      minWidth: 0,
      overflowWrap: 'break-word' as const,
      wordBreak: 'break-word' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
    },
    expandedFullField: {
      gridColumn: '1 / -1',
      minWidth: 0,
      overflowWrap: 'break-word' as const,
      wordBreak: 'break-word' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
    },
    expandedLabel: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.bold,
      color: themeColors.fontColor,
      fontFamily,
    },
    expandedValue: {
      fontSize: fontSizes.base,
      color: themeColors.fontColor,
      fontFamily,
    },
  }
})

export function useStyles(params: { isDark: boolean; themeColors: ThemeConfig }) {
  const { classes } = useStylesBase(params)
  const { themeColors } = params
  const badgeStyles = useMemo(
    () => ({
      authenticatedBadge: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      unauthenticatedBadge: {
        backgroundColor: themeColors.background,
        textColor: themeColors.fontColor,
        borderColor: themeColors.borderColor,
      },
    }),
    [themeColors],
  )
  return { classes, badgeStyles }
}
