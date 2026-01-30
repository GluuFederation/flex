import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

const styles = makeStyles()({
  dialog: {
    borderRadius: 0,
  },
  button: {
    borderRadius: 0,
    textTransform: 'none',
    padding: '5px',
  },
  logout: {
    'color': customColors.white,
    'backgroundColor': customColors.logo,
    '&:hover': {
      backgroundColor: customColors.accentRed,
    },
  },
  countdown: {
    color: customColors.accentRed,
  },
})

export default styles
