import customColors from '@/customColors'
import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
  },
  whiteColor: {
    color: customColors.white,
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  btnContainer: {
    position: 'relative',
    top: 8,
    textTransform: 'none',
    color: customColors.white,
  },
  notificationBtn: {
    'position': 'relative',
    'textTransform': 'none',
    'padding': '2px',
    'cursor': 'pointer',
    'border': 'none',
    'background': 'none',
    '&:active': {
      backgroundColor: 'rgba(217, 217, 217, 0.43)',
      transform: 'scale(0.95)',
    },
  },
  topElm: {
    zIndex: 9999,
  },
}))

export default styles
