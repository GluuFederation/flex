import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { SPACING } from '@/constants'
import { fontFamily } from '@/styles/fonts'
import { createFormCardStyles } from '@/styles/formStyles'

interface UserFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<UserFormPageStylesParams>()((_, { isDark, themeColors }) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formCardStyles = createFormCardStyles({ isDark, cardBg })

  return {
    page: {
      fontFamily,
      paddingTop: SPACING.PAGE,
    },
    formCard: formCardStyles.formCard,
    content: formCardStyles.content,
  }
})
