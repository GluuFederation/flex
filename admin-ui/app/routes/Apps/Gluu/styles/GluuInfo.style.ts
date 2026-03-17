import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { isDark, themeColors }) => ({
  modalHeader: {
    backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
    color: themeColors.fontColor,
    borderColor: isDark ? customColors.darkBorder : customColors.lightBorder,
  },
  modalBody: {
    backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
    color: themeColors.fontColor,
    borderColor: isDark ? customColors.darkBorder : customColors.lightBorder,
  },
  modalFooter: {
    backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
    color: themeColors.fontColor,
    borderColor: isDark ? customColors.darkBorder : customColors.lightBorder,
  },
  title: {
    fontWeight: fontWeights.bold,
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  statusMessage: {
    margin: 0,
    fontFamily,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.relaxed,
  },
  detailText: {
    margin: '4px 0',
  },
}))
