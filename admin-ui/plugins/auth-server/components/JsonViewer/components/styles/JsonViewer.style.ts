import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontSizes, lineHeights } from '@/styles/fonts'

interface StylesParams {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_, { themeColors }) => ({
  container: {
    backgroundColor: 'transparent !important',
    fontFamily: 'monospace',
    fontSize: fontSizes.base,
    lineHeight: lineHeights.tight,
  },
  textColor: {
    color: `${themeColors.fontColor} !important`,
  },
  clickableLabel: {
    color: `${themeColors.fontColor} !important`,
  },
  iconSize: {
    fontSize: '1.4em !important',
    lineHeight: '1 !important',
  },
  iconColor: {
    color: `${themeColors.fontColor} !important`,
  },
}))
