import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

const LOGO_WIDTH = '260px'

const LOGO_MARGIN_BOTTOM = 50

const useStyles = makeStyles()(() => ({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: customColors.black,
    color: customColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: LOGO_WIDTH,
    height: 'auto',
    marginBottom: LOGO_MARGIN_BOTTOM,
  },
  message: {
    color: customColors.white,
  },
  retryButton: {
    border: 0,
    backgroundColor: 'transparent',
    color: customColors.white,
    textDecoration: 'underline',
  },
}))

export { useStyles }
