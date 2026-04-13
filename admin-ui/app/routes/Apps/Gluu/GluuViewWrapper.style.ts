import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  missingRoot: {
    backgroundColor: 'transparent',
    padding: theme.spacing(2),
  },
}))
