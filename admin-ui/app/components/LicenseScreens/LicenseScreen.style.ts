import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights } from '@/styles/fonts'

const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((_theme, { themeColors }) => ({
  container: {
    width: '100%',
    maxWidth: 1140,
    margin: '0 auto',
    padding: '0 16px',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  logoSection: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '48px 0',
    textAlign: 'center',
  },
  messageBlock: {
    width: '100%',
    maxWidth: 760,
    margin: '0 auto 16px',
    textAlign: 'center',
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },
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
    marginBottom: 0,
  },
}))

export default useStyles
