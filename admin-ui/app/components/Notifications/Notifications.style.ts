import { makeStyles } from 'tss-react/mui'

const ICON_SIZE = '26px'

const useStyles = makeStyles()(() => ({
  optionLabel: {
    whiteSpace: 'nowrap',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    display: 'block',
  },
}))

export { useStyles }
