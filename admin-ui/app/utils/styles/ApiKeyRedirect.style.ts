import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily } from '@/styles/fonts'

const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((_theme, { themeColors }) => ({
  redirectingScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    backgroundColor: themeColors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderImage: {
    display: 'block',
    width: '260px',
    height: 'auto',
  },
  redirectingText: {
    fontFamily,
    color: themeColors.fontColor,
    marginTop: 16,
    textAlign: 'center',
  },
}))

export default useStyles
