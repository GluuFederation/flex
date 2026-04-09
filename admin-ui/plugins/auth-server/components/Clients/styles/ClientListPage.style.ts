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
    badgeList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      alignItems: 'center',
    },
    scopeLink: {
      'cursor': 'pointer',
      'color': themeColors.badges.filledBadgeBg,
      'fontWeight': fontWeights.regular,
      'fontSize': fontSizes.base,
      'textDecoration': 'underline',
      '&:hover': {
        color: themeColors.badges.filledBadgeBg,
        textDecoration: 'underline',
      },
    },
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
      position: 'relative' as const,
      zIndex: 0,
      overflow: 'visible',
      boxSizing: 'border-box' as const,
    },
    searchCardContent: {
      position: 'relative' as const,
      zIndex: 2,
      isolation: 'isolate' as const,
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
      'position': 'relative' as const,
      'overflow': 'visible',
      'boxSizing': 'border-box' as const,
      '& table td': { verticalAlign: 'middle' },
      '& table th': { verticalAlign: 'middle' },
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
    }),
    [themeColors],
  )
  return { classes, badgeStyles }
}
