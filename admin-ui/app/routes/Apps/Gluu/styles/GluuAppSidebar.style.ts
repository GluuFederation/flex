// @ts-nocheck
import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()({
  waveContainer: {
    position: 'relative',
    bottom: 93,
    left: 0,
    top: 140,
    height: 70,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  wave: {
    position: 'relative',
    top: -75
  },
  powered: {
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    top: -130,
    fontWeight: 500
  },
  waveContainerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    background: 'inherit'
  }
})

export default styles
