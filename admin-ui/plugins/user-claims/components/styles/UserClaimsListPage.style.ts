import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  ICON_SIZE,
  SPACING,
  MOBILE_MEDIA_QUERY,
  createMobilePageTitleStyle,
} from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createSearchCardStyle } from '@/styles/searchCardStyle'
import { fontFamily, fontWeights, fontSizes } from '@/styles/fonts'
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
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    page: { fontFamily, paddingTop: SPACING.PAGE },
    cellText: {
      color: themeColors.fontColor,
      fontWeight: fontWeights.medium,
      fontFamily,
    },
    statusBadge: { minWidth: STATUS_BADGE_MIN_WIDTH },
    editIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
    viewIcon: { fontSize: ICON_SIZE.SM },
    addIcon: { fontSize: ICON_SIZE.MD },
    searchCard: createSearchCardStyle({ cardBg, isDark }),
    searchCardContent: {
      position: 'relative',
      zIndex: 2,
      isolation: 'isolate',
      pointerEvents: 'auto',
    },
    // This page has two filters (Status + Sort By) where most list pages have
    // one, so below 1200px the shared toolbar's fixed control width leaves the
    // action buttons no room and clips the last one. Scoped to this page only.
    searchToolbar: {
      // The shared toolbar is fluid, but it assumes one filter. This page has
      // two, so filters + actions are three items competing for one row and the
      // buttons get squeezed into an ellipsis. Give the actions their own row
      // and keep everything else stretching, matching the Webhook behaviour.
      // Selectors are doubled (&&) because the shared rules have equal
      // specificity and would otherwise win on injection order.
      '@media (max-width: 1200px)': {
        // Filters share their row evenly, as the shared toolbar intends.
        '&& > div:has(> div > select)': {
          flex: '1 1 0',
          minWidth: 0,
        },
        // The filter definitions set a fixed pixel width, which lands as an
        // inline style on the select wrapper and stops it stretching. Release
        // it here so the filters fill their row like the buttons below.
        '&& > div:has(> div > select) > div': {
          width: '100% !important',
        },
        '&& > div:has(> div > button)': {
          flex: '1 1 100%',
          minWidth: 0,
        },
        // Stretch the buttons across that row so no dead space is left beside
        // them; with a full row they never need to truncate.
        '&& > div:has(> div > button) > div': {
          width: '100%',
        },
        '&& button': {
          flex: '1 1 0',
          minWidth: 0,
          whiteSpace: 'nowrap',
        },
        '&& button > span': {
          minWidth: 0,
          overflow: 'visible',
          textOverflow: 'clip',
        },
      },
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
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        '& table td': { verticalAlign: 'top' },
      },
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
        backgroundColor: themeColors.background,
        textColor: themeColors.fontColor,
        borderColor: themeColors.borderColor,
      },
    }),
    [themeColors],
  )
  return { classes, badgeStyles }
}
