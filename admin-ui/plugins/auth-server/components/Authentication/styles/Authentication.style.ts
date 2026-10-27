import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { ICON_SIZE, createMobilePageTitleStyle } from '@/constants'
import { createFormCardStyles } from '@/styles/formStyles'
import type { ThemeConfig } from '@/context/theme/config'

type AuthenticationStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'

export const useStyles = makeStyles<AuthenticationStylesParams>()((
  _theme: Theme,
  { isDark, themeColors },
) => {
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const formCardStyles = createFormCardStyles({ isDark, cardBg })

  return {
    addIcon: { fontSize: ICON_SIZE.MD },
    mobilePageTitle: createMobilePageTitleStyle(themeColors.fontColor),
    formCard: formCardStyles.formCard,
    content: {
      ...formCardStyles.content,
      maxWidth: WIDTH_FULL,
      minWidth: 0,
    },
  }
})
