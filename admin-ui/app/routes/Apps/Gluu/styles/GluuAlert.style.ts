// @ts-nocheck
import { makeStyles } from 'tss-react/mui'
// import { useTheme } from '@mui/material/styles';

const styles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

export default styles
