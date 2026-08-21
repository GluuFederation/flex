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
import { createSearchCardStyle } from '@/styles/searchCardStyle'
import { fontFamily } from '@/styles/fonts'

const useStylesBase = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
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

    searchCard: createSearchCardStyle({ cardBg, isDark }),
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

    cellName: { color: themeColors.fontColor, fontWeight: 500, overflowWrap: 'anywhere' },
    cellMuted: { color: themeColors.fontColor, fontFamily },
    cellComments: {
      color: themeColors.fontColor,
      fontFamily,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      wordBreak: 'break-word',
    },
    statusBadge: { minWidth: 80 },
    viewIcon: { fontSize: ICON_SIZE.SM },
    downloadIcon: { fontSize: ICON_SIZE.SM },
    activateIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
  }
})

export const useStyles = (params: { isDark: boolean; themeColors: ThemeConfig }) => {
  const { classes } = useStylesBase(params)
  const { themeColors } = params

  const badgeStyles = useMemo(
    () => ({
      statusBadgeActive: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
      statusBadgeBackup: {
        backgroundColor: themeColors.badges.filledBadgeBg,
        textColor: themeColors.badges.filledBadgeText,
        borderColor: 'transparent',
      },
    }),
    [themeColors],
  )

  return { classes, badgeStyles }
}
