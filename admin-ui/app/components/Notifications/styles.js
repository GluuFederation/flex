import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  whiteColor: {
    color: '#FFFFFF',
  },
  paper: {
    marginRight: theme.spacing(2),
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
