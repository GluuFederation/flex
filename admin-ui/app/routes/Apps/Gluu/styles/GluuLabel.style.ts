import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles<{ labelColor: string }>()((_, { labelColor }) => ({
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: labelColor,
  },
  titleContent: {
    display: 'flex',
    alignItems: 'center',
  },
}))
