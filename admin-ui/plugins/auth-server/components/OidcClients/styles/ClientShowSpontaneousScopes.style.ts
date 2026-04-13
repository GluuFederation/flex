import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'
import customColors from '@/customColors'
import type { ThemeConfig } from '@/context/theme/config'

type ClientShowSpontaneousScopesStyleParams = {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<ClientShowSpontaneousScopesStyleParams>()(
  (_theme, { themeColors }) => ({
    modalTitle: {
      color: `${customColors.black} !important`,
    },
    badge: {
      backgroundColor: themeColors.background,
      color: customColors.white,
      marginBottom: SPACING.CARD_CONTENT_GAP / 2,
    },
    emptyState: {
      color: customColors.black,
    },
    closeButton: {
      backgroundColor: `${themeColors.background} !important`,
      color: `${themeColors.fontColor} !important`,
      border: 'none !important',
    },
  }),
)
