import { makeStyles } from 'tss-react/mui'
const styles = makeStyles()((theme) => ({
  root: {
    'width': '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

export default styles
