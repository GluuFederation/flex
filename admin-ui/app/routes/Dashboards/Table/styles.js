import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles({
  table: {
    minWidth: 600,
    borderCollapse: 'unset',
  },
  transparentBg: {
    background: 'transparent',
  },
  whiteText: {
    color: '#FFFFFF',
    borderBottom: 'none',
    padding: '10px 20px 10px 20px',
  },
  standardText: {
    color: '#303641',
    borderBottom: 'none',
    padding: '10px 20px 10px 20px',
  },
  trWhiteBg: {
    background: '#FFFFFF',
    color: '#303641',
  },
  roundedLeft: {
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 18,
  },
  roundedRight: {
    borderBottomRightRadius: 18,
    borderTopRightRadius: 18,
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 40,
  },
  username: {
    position: 'relative',
    top: 6,
  },
})

export default styles
