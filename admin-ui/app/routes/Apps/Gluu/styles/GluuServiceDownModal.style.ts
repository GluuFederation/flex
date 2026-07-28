import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

const LOGO_WIDTH = '120px'

const LOGO_MARGIN = 50

const CONTENT_MAX = '60%'

const CONTENT_GAP = '40px'

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
  logoCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logo: {
    width: LOGO_WIDTH,
    height: 'auto',
    margin: LOGO_MARGIN,
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    color: customColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    maxWidth: CONTENT_MAX,
    maxHeight: CONTENT_MAX,
    margin: 'auto',
    gap: CONTENT_GAP,
    flexWrap: 'wrap',
  },
  illustration: {
    width: 'auto',
    height: 'auto',
    fill: customColors.white,
  },
  heading: {
    color: customColors.white,
    fontWeight: 'bolder',
  },
  retryButton: {
    border: 0,
    backgroundColor: 'transparent',
    color: customColors.white,
    textDecoration: 'underline',
  },
}))

export { useStyles }
