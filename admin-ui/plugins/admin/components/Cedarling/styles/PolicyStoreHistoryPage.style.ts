import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import {
  BORDER_RADIUS,
  ICON_SIZE,
  MOBILE_MEDIA_QUERY,
  SPACING,
  createMobilePageTitleStyle,
} from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily } from '@/styles/fonts'
import customColors from '@/customColors'

const useStylesBase = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  return {
    page: {
      fontFamily,
      paddingTop: SPACING.PAGE,
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        paddingBottom: `${SPACING.CONTENT_PADDING}px`,
        boxSizing: 'border-box',
      },
    },
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    infoAlert: {
      ...cardBorderStyle,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: 12,
      marginBottom: SPACING.PAGE,
      backgroundColor: themeColors.infoAlert.background,
      color: themeColors.infoAlert.text,
    },
    infoIcon: { fontSize: ICON_SIZE.SM, marginTop: 2 },
    infoText: { fontSize: 13, lineHeight: 1.5 },
    cellName: { color: themeColors.fontColor, fontWeight: 500, wordBreak: 'break-word' },
    cellMuted: { color: themeColors.fontColor, opacity: 0.8, fontSize: 13 },
    cellComments: {
      color: themeColors.fontColor,
      opacity: 0.8,
      fontSize: 13,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      wordBreak: 'break-word',
    },
    statusBadge: { minWidth: 80 },
    actionIcon: { fontSize: ICON_SIZE.SM },
    activeIcon: { fontSize: ICON_SIZE.SM, color: customColors.statusActive },
  }
})

export const useStyles = (params: { isDark: boolean; themeColors: ThemeConfig }) => {
  const { classes } = useStylesBase(params)
  const { themeColors } = params

  const badgeStyles = useMemo(
    () => ({
      active: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      backup: {
        backgroundColor: themeColors.background,
        textColor: themeColors.fontColor,
        borderColor: themeColors.borderColor,
      },
    }),
    [themeColors],
  )

  return { classes, badgeStyles }
}
