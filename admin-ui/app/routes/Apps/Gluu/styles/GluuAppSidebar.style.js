import { makeStyles } from '@mui/styles'

const styles = makeStyles(() => ({
  waveContainer: {
    position: 'relative',
    bottom: 93,
    left: 0,
    top: 140,
    height: 70,
    width: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wave: {
    width: 250,
    position: 'relative',
    top: -75
  },
  powered: {
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    top: -130,
    fontWeight: 500,
  }
}))

export default styles
