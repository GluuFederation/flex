import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, ICON_SIZE, SPACING } from '@/constants'
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
    page: { fontFamily, paddingTop: SPACING.PAGE },
    cellDisplayName: { color: themeColors.fontColor, fontWeight: 500 },
    cellUrl: {
      wordBreak: 'break-all',
      maxWidth: '350px',
      fontFamily,
      color: themeColors.fontColor,
    },
    statusBadge: { minWidth: 80 },
    httpMethodBadge: { width: 72, minWidth: 72, maxWidth: 72, boxSizing: 'border-box' },
    editIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
    addIcon: { fontSize: ICON_SIZE.MD },
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
      '& table td': { verticalAlign: 'middle', minWidth: 0, lineHeight: '28px' },
      '& table th': { verticalAlign: 'middle', lineHeight: '28px' },
    },
  }
})

export const useStyles = (params: { isDark: boolean; themeColors: ThemeConfig }) => {
  const { classes } = useStylesBase(params)
  const { isDark, themeColors } = params
  const badgeStyles = useMemo(
    () => ({
      statusBadgeEnabled: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      statusBadgeDisabled: {
        backgroundColor: themeColors.background,
        textColor: themeColors.fontColor,
        borderColor: themeColors.borderColor,
      },
      httpMethodBadgeGetPost: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      httpMethodBadgePutPatch: {
        backgroundColor: customColors.orange,
        textColor: customColors.white,
        borderColor: 'transparent',
      },
      httpMethodBadgeDelete: {
        backgroundColor: customColors.statusInactive,
        textColor: customColors.white,
        borderColor: 'transparent',
      },
      httpMethodBadgeDefault: {
        backgroundColor: isDark ? customColors.darkBackground : customColors.buttonLightBg,
        textColor: isDark ? customColors.white : customColors.primaryDark,
        borderColor: isDark ? customColors.darkBorder : customColors.lightBorder,
      },
    }),
    [isDark, themeColors],
  )
  return { classes, badgeStyles }
}
