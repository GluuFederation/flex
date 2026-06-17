import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'
import { CEDARLING_CONFIG_SPACING } from '@/constants'

type StylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const HALF_GAP = Math.round((CEDARLING_CONFIG_SPACING.BUTTONS_MT + 5) / 2)

export const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => ({
  contentArea: {
    gap: 0,
  },
  title: {
    fontFamily,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: 'normal',
    color: themeColors.fontColor,
    margin: 0,
  },
  description: {
    marginTop: HALF_GAP,
  },
  buttonRow: {
    marginTop: HALF_GAP,
  },
}))
