import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { createMobilePageTitleStyle } from '@/constants'
import { createFormCardStyles } from '@/styles/formStyles'
import type { ThemeConfig } from '@/context/theme/config'

type FidoFormPageStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<FidoFormPageStylesParams>()((
  _theme: Theme,
  { isDark, themeColors },
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formCardStyles = createFormCardStyles({ isDark, cardBg })

  return {
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    formCard: formCardStyles.formCard,
    content: formCardStyles.content,
  }
})
