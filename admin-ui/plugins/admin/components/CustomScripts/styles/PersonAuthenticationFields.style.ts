import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'

interface PersonAuthenticationFieldsStylesParams {
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<PersonAuthenticationFieldsStylesParams>()(
  (_, { themeColors }) => ({
    errorText: {
      color: themeColors.errorColor,
      marginTop: 4,
    },
  }),
)
