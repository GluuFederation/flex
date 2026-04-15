import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()(() => ({
  tableContainer: {
    minHeight: 300,
    maxHeight: '50vh',
    overflowY: 'auto',
  },
}))
