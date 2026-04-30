import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
import { fontSizes, fontWeights } from '@/styles/fonts'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => {
  return {
    errorMessage: {
      color: customColors.accentRed,
      margin: 0,
    },
    errorList: {
      listStyle: 'none',
      paddingLeft: 0,
      margin: 0,
    },
    errorItem: {
      color: customColors.accentRed,
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 12,
      fontSize: fontSizes.base,
      gap: 2,
    },
    errorLabel: {
      fontWeight: fontWeights.semiBold,
      fontSize: fontSizes.md,
    },
    errorValue: {
      color: themeColors.fontColor,
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  }
})
