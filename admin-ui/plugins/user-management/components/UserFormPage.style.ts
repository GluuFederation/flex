import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { BORDER_RADIUS, SPACING } from '@/constants'
import { fontFamily } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface UserFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<UserFormPageStylesParams>()((_, { isDark, themeColors }) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  const cardBorderStyle = getCardBorderStyle({ isDark })

  return {
    page: {
      fontFamily,
      paddingTop: SPACING.PAGE,
    },
    formCard: {
      width: '100%',
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      padding: `${SPACING.CARD_PADDING}px`,
      position: 'relative' as const,
      overflow: 'visible' as const,
      boxSizing: 'border-box',
    },
  }
})
