import { makeStyles } from 'tss-react/mui'
import { SPACING } from '@/constants'
import customColors from '@/customColors'
import type { ClientShowSpontaneousScopesStyleParams } from 'Plugins/auth-server/components/OidcClients/types'

export const useStyles = makeStyles<ClientShowSpontaneousScopesStyleParams>()(
  (_theme, { themeColors }) => ({
    modalContainer: {
      'outline': 'none',
      'boxShadow': 'none',
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
      },
    },
    scopeList: {
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_CONTENT_GAP / 2,
      minHeight: 48,
    },
    badge: {
      backgroundColor: themeColors.background,
      color: customColors.white,
    },
  }),
)
