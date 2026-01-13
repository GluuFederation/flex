import { makeStyles } from 'tss-react/mui'

interface UserIconStylesProps {
  iconSize: number
}

export const useStyles = makeStyles<UserIconStylesProps>()((theme, { iconSize }) => ({
  container: {
    position: 'relative',
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    flexShrink: 0,
  },
  innerBox: {
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
}))
