import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles';

const styles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  whiteColor: {
    color: '#FFFFFF',
  },
  paper: {
    marginRight: useTheme().spacing(2),
  },
  btnContainer: {
    position: 'relative',
    top: 8,
    textTransform: 'none',
    color: '#FFFFFF',
  },
  topElm: {
    zIndex: 9999
  }
}))

export default styles
