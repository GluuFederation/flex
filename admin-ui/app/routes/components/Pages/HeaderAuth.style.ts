import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
  logoWrap: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  logoLink: {
    display: 'inline-block',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  text: {
    textAlign: 'center',
  },
}))
