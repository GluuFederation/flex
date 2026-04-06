import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontWeights, lineHeights } from '@/styles/fonts'

const ICON_SIZE_SM = 18
const ICON_SIZE_MD = 20
const SCOPE_TYPE_MIN_WIDTH = 90
const CARD_INNER_PADDING = 20
const TABLE_LINE_HEIGHT = lineHeights.relaxed

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
    cellDescription: {
      display: 'block',
      minWidth: 0,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontFamily,
      color: themeColors.fontColor,
    },
    scopeTypeBadge: { minWidth: SCOPE_TYPE_MIN_WIDTH },
    editIcon: { fontSize: ICON_SIZE_SM },
    deleteIcon: { fontSize: ICON_SIZE_SM },
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
      '& table td': { verticalAlign: 'top', minWidth: 0, lineHeight: TABLE_LINE_HEIGHT },
      '& table th': { verticalAlign: 'middle', lineHeight: TABLE_LINE_HEIGHT },
    },
    clientsLink: {
      'color': themeColors.fontColor,
      'fontWeight': fontWeights.semiBold,
      'textDecoration': 'none',
      '&:hover': { textDecoration: 'underline' },
    },
  }
})

export const useStyles = (params: { isDark: boolean; themeColors: ThemeConfig }) => {
  const { classes } = useStylesBase(params)
  const { themeColors } = params
  const badgeStyles = useMemo(() => {
    return {
      scopeTypeBadge: {
        oauth: {
          backgroundColor: themeColors.badges.filledBadgeBg,
          textColor: themeColors.badges.filledBadgeText,
          borderColor: 'transparent',
        },
        openid: {
          backgroundColor: themeColors.badges.filledBadgeBg,
          textColor: themeColors.badges.filledBadgeText,
          borderColor: 'transparent',
        },
        dynamic: {
          backgroundColor: customColors.orange,
          textColor: customColors.white,
          borderColor: 'transparent',
        },
        spontaneous: {
          backgroundColor: customColors.chartPurple,
          textColor: customColors.white,
          borderColor: 'transparent',
        },
        uma: {
          backgroundColor: customColors.statusInactive,
          textColor: customColors.white,
          borderColor: 'transparent',
        },
        default: {
          backgroundColor: themeColors.badges.disabledBg,
          textColor: themeColors.badges.disabledText,
          borderColor: 'transparent',
        },
      },
      trueBadge: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      falseBadge: {
        backgroundColor: themeColors.badges.disabledBg,
        textColor: themeColors.badges.disabledText,
        borderColor: 'transparent',
      },
    }
  }, [themeColors])
  return { classes, badgeStyles }
}
