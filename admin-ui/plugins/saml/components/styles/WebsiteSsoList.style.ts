import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, ICON_SIZE, SPACING } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { createSearchCardStyle } from '@/styles/searchCardStyle'
import { fontFamily } from '@/styles/fonts'

const CARD_INNER_PADDING = 20

export const useStyles = makeStyles<{ isDark: boolean; themeColors: ThemeConfig }>()((
  _,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  return {
    page: { fontFamily, paddingTop: SPACING.PAGE },
    searchCard: createSearchCardStyle({ cardBg, isDark }),
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
    editIcon: { fontSize: ICON_SIZE.SM },
    deleteIcon: { fontSize: ICON_SIZE.SM },
    viewIcon: { fontSize: ICON_SIZE.SM },
    addIcon: { fontSize: ICON_SIZE.MD },
  }
})
