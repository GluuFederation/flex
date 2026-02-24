import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING, MAPPING_SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily } from '@/styles/fonts'
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
    cellName: { color: themeColors.fontColor, fontWeight: 600 },
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
    scriptTypeBadge: { minWidth: 80 },
    errorBadgeMargin: { marginLeft: SPACING.CARD_CONTENT_GAP },
    enabledBadge: { minWidth: 60 },
    editIcon: { fontSize: 18 },
    deleteIcon: { fontSize: 18 },
    viewIcon: { fontSize: 18 },
    addIcon: { fontSize: 20 },
    searchCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.PAGE}px 20px`,
      marginBottom: '20px',
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
      'padding': '20px',
      'position': 'relative',
      'overflow': 'visible',
      'boxSizing': 'border-box',
      '& table': { minWidth: 0 },
      '& table td': { verticalAlign: 'top', minWidth: 0, lineHeight: '28px' },
      '& table th': { verticalAlign: 'middle', lineHeight: '28px' },
    },
    errorMessage: {
      color: themeColors.errorColor,
      marginBottom: MAPPING_SPACING.CARD_MARGIN_BOTTOM,
    },
  }
})

export function useStyles(params: { isDark: boolean; themeColors: ThemeConfig }) {
  const { classes } = useStylesBase(params)
  const { themeColors } = params
  const badgeStyles = useMemo(() => {
    const activeBg = themeColors.badges.filledBadgeBg
    const activeText = themeColors.badges.filledBadgeText
    return {
      scriptTypeBadge: {
        backgroundColor: themeColors.badges.statusActiveBg,
        textColor: themeColors.badges.statusActive,
        borderColor: themeColors.badges.statusActiveBg,
      },
      enabledBadge: {
        backgroundColor: activeBg,
        textColor: activeText,
        borderColor: 'transparent',
      },
      disabledBadge: {
        backgroundColor: themeColors.badges.disabledBg,
        textColor: themeColors.badges.disabledText,
        borderColor: 'transparent',
      },
      errorBadge: {
        backgroundColor: themeColors.errorColor,
        textColor: activeText,
        borderColor: 'transparent',
      },
    }
  }, [themeColors])
  return { classes, badgeStyles }
}
