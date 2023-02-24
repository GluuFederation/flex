import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles';

const styles = makeStyles(() => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: useTheme().spacing(2),
    },
  },
}))

export default styles
