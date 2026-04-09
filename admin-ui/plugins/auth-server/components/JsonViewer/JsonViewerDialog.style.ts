import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontSizes, lineHeights } from '@/styles/fonts'

const BODY_MAX_HEIGHT = '50vh'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => {
  return {
    modalContainer: {},
    viewerBody: {
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: BODY_MAX_HEIGHT,
    },
    loadingContainer: {
      padding: '2rem',
      textAlign: 'center',
    },
    loadingText: {
      marginTop: '1rem',
      color: themeColors.textMuted,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
    },
  }
})
