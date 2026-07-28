import { makeStyles } from 'tss-react/mui'

const ROW_MARGIN_TOP = '10px'

const useStyles = makeStyles()(() => ({
  row: {
    marginTop: ROW_MARGIN_TOP,
  },
}))

export { useStyles }
