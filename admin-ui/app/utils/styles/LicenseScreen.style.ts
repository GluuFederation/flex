import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((_theme, { themeColors }) => ({
  title: {
    color: themeColors.formFooter.back.backgroundColor,
    fontFamily,
    fontSize: fontSizes['2.5xl'],
    fontStyle: 'normal',
    fontWeight: fontWeights.semiBold,
    lineHeight: '45px',
  },
  error: {
    color: themeColors.errorColor,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
  },
  logo: {
    maxWidth: 200,
  },
  cardWrapper: {
    display: 'block',
    width: '100%',
  },
}))

export default useStyles
