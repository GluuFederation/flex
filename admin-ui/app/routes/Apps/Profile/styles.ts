import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()({
  centerCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    position: 'relative',
  },
  pencil_wrapper: {
    cursor: 'pointer',
    position: 'absolute',
    top: '-25%',
    left: '55%',
  },
  avatar_wrapper: {
    position: 'relative',
  },
})

export default styles
