import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import type { GluuInlineAlertSeverity } from './types'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

interface GluuInlineAlertStyleParams {
  themeColors: ThemeConfig
  severity: GluuInlineAlertSeverity
}

export const useStyles = makeStyles<GluuInlineAlertStyleParams>()((
  _,
  { themeColors, severity },
) => {
  const titleColor =
    severity === 'error'
      ? themeColors.errorColor
      : severity === 'warning'
        ? themeColors.warningColor
        : themeColors.infoAlert.text

  return {
    root: {
      fontFamily,
      padding: 0,
      boxSizing: 'border-box',
      border: 'none',
      backgroundColor: 'transparent',
    },
    title: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semiBold,
      color: titleColor,
      margin: 0,
      marginBottom: 4,
    },
    detail: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      color: themeColors.textMuted,
      margin: 0,
    },
  }
})
