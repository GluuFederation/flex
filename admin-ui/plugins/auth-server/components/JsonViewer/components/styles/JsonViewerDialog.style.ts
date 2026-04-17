import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'

const BODY_MAX_HEIGHT = '50vh'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => {
  return {
    modalContainer: {
      'outline': 'none',
      'boxShadow': 'none',
      'border': 'none !important',
      '&:focus, &:focus-visible': {
        outline: 'none',
        boxShadow: 'none',
      },
    },
    viewerBody: {
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: BODY_MAX_HEIGHT,
    },
    viewerPlaceholder: {
      minHeight: '240px',
      borderRadius: '4px',
      backgroundColor: themeColors.card.background,
    },
    footer: {
      width: '100%',
      justifyContent: 'flex-end !important',
    },
  }
})
