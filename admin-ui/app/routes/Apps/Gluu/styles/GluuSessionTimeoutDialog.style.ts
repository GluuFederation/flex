import { makeStyles } from 'tss-react/mui'
import red from '@mui/material/colors/red'
import customColors from '@/customColors'

const styles = makeStyles()({
  dialog: {
    borderRadius: 0,
  },
  button: {
    borderRadius: 0,
    textTransform: 'none',
    padding: 5,
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
