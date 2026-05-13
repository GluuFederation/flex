import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  linkRow: {
    display: 'flex',
    marginBottom: theme.spacing(5),
  },
  supportLink: {
    marginLeft: 'auto',
    textDecoration: 'none',
  },
}))
