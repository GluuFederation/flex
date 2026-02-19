import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  cedarMessageRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '90vh',
    padding: theme.spacing(2.5),
  },
  sidebarLoaderRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '80vh',
    padding: theme.spacing(2),
  },
}))
