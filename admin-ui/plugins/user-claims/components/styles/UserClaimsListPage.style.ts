import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'

const ICON_SIZE_SM = 18
const ICON_SIZE_MD = 20
const CARD_INNER_PADDING = 20
const STATUS_BADGE_MIN_WIDTH = 64
const EXPANDED_ROW_MIN_CELL = 160

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
    cellText: {
      color: themeColors.fontColor,
      fontWeight: fontWeights.medium,
      fontFamily,
    },
    statusBadge: { minWidth: STATUS_BADGE_MIN_WIDTH },
    editIcon: { fontSize: ICON_SIZE_SM },
    deleteIcon: { fontSize: ICON_SIZE_SM },
    viewIcon: { fontSize: ICON_SIZE_SM },
    addIcon: { fontSize: ICON_SIZE_MD },
    searchCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.PAGE}px ${CARD_INNER_PADDING}px`,
      marginBottom: `${CARD_INNER_PADDING}px`,
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
    },
    expandedGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${EXPANDED_ROW_MIN_CELL}px, 1fr))`,
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
    expandedDescField: {
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
      fontWeight: fontWeights.semiBold,
      color: themeColors.textMuted ?? themeColors.fontColor,
      fontFamily,
    },
    expandedValue: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.bold,
      color: themeColors.fontColor,
      fontFamily,
    },
    expandedBadgeList: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 4,
      alignItems: 'center',
    },
  }
})

export const useStyles = (params: { isDark: boolean; themeColors: ThemeConfig }) => {
  const { classes } = useStylesBase(params)
  const { themeColors } = params
  const badgeStyles = useMemo(
    () => ({
      activeBadge: {
        backgroundColor: themeColors.badges.statusActiveBg,
        textColor: themeColors.badges.statusActive,
        borderColor: themeColors.badges.statusActiveBg,
      },
      inactiveBadge: {
        backgroundColor: customColors.statusInactiveBg,
        textColor: customColors.statusInactive,
        borderColor: customColors.statusInactiveBg,
      },
      filledBadge: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      statusEnabledBadge: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      statusDisabledBadge: {
        backgroundColor: themeColors.badges.disabledBg,
        textColor: themeColors.badges.disabledText,
        borderColor: 'transparent',
      },
    }),
    [themeColors],
  )
  return { classes, badgeStyles }
}
