import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { SPACING, createMobilePageTitleStyle } from '@/constants'
import { fontFamily } from '@/styles/fonts'
import { createFormCardStyles } from '@/styles/formStyles'

interface SsaFormPageStylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<SsaFormPageStylesParams>()((_, { isDark, themeColors }) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formCardStyles = createFormCardStyles({ isDark, cardBg })

  return {
    page: {
      fontFamily,
      paddingTop: SPACING.PAGE,
    },
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    formCard: formCardStyles.formCard,
    content: formCardStyles.content,
  }
})
