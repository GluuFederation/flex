import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '77vh'
  },
  block: {
    width: 120,
    height: 48,
    background: '#303641',
    border: '1px solid #252a32',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    cursor: 'grab',
    fontWeight: 500,
    marginBottom: 5,
  },
  blockContainerTitle: {
    textAlign: 'left',
    paddingBottom: 10,
    marginBottom: 15,
    borderBottom: '1.5px solid #b6b5b5',
  },
  boardBlock: {
    minHeight: '70vh'
  }
}))

export default styles
