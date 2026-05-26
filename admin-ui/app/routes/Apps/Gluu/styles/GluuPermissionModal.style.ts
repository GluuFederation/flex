import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((theme, { themeColors }) => ({
  title: {
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights.XXXLoose,
    color: themeColors.fontColor,
    margin: 0,
    paddingBottom: theme.spacing(2),
    textAlign: 'center',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  modalBody: {
    textAlign: 'center',
    color: themeColors.fontColor,
  },
  mutedText: {
    color: customColors.textSecondary,
    marginBottom: theme.spacing(2),
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}))
