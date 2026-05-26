import { makeStyles } from 'tss-react/mui'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((theme, { themeColors }) => ({
  warningIcon: {
    marginBottom: theme.spacing(1),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights.normal,
    color: themeColors.fontColor,
    margin: 0,
    paddingBottom: theme.spacing(2),
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  question: {
    margin: 0,
    color: themeColors.fontColor,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.normal,
  },
}))
