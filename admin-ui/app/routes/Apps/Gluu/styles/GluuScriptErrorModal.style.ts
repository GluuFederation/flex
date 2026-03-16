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
    errorBody: {
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: BODY_MAX_HEIGHT,
    },
    errorText: {
      color: themeColors.fontColor,
      fontFamily: 'monospace',
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
      margin: 0,
    },
  }
})
