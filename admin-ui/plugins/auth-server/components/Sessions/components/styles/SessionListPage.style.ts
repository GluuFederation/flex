import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  SPACING,
  ICON_SIZE,
  INPUT,
  TOOLBAR,
  MOBILE_MEDIA_QUERY,
  createMobilePageTitleStyle,
} from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createSearchCardStyle } from '@/styles/searchCardStyle'
import { fontFamily, fontWeights } from '@/styles/fonts'

const CARD_INNER_PADDING = SPACING.CARD_CONTENT_GAP * 2 + 4
const STATUS_BADGE_MIN_WIDTH = 80

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
      paddingTop: SPACING.PAGE,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingBottom: SPACING.CONTENT_PADDING,
        boxSizing: 'border-box' as const,
      },
    },
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),

    searchCard: createSearchCardStyle({ cardBg, isDark }),
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
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        flexWrap: 'nowrap' as const,
        gap: 8,
      },
    },
    searchToolbarWrapper: {
      flex: 1,
      minWidth: TOOLBAR.SEARCH_MIN_WIDTH,
      overflow: 'visible',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        minWidth: 0,
      },
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
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        marginLeft: 0,
        flexShrink: 0,
      },
    },
    mobileFilterTrigger: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'height': INPUT.HEIGHT,
      'width': INPUT.HEIGHT,
      'padding': 0,
      'border': 0,
      'background': 'transparent',
      'color': themeColors.fontColor,
      'cursor': 'pointer',
      '& svg': {
        fontSize: ICON_SIZE.LG,
      },
    },
    filterPopover: {
      left: 'auto !important' as 'auto',
      right: 0,
      transform: 'none !important' as 'none',
    },
    toolbarButton: {
      minWidth: TOOLBAR.MIN_WIDTH,
      position: 'relative',
      zIndex: 20,
      pointerEvents: 'auto' as const,
    },
    toolbarButtonIcon: {
      fontSize: ICON_SIZE.SM,
      marginRight: 4,
      flexShrink: 0,
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

    cellText: {
      color: themeColors.fontColor,
      fontWeight: fontWeights.medium,
      fontFamily,
    },
    statusBadge: { minWidth: STATUS_BADGE_MIN_WIDTH },
    deleteIcon: { fontSize: ICON_SIZE.SM },
  }
})

export const useStyles = (params: { isDark: boolean; themeColors: ThemeConfig }) => {
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
