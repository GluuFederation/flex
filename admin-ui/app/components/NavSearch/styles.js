import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles';

const styles = makeStyles(() => ({
  root: {
    padding: '1px 10px 1px 10px',
    display: 'flex',
    alignItems: 'center',
    width: 300,
    borderRadius: 30,
    marginRight: 20,
    height: 40,
    marginTop: 10,
  },
  input: {
    marginLeft: useTheme().spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  mobile: {
    width: '90%',
    marginTop: 20,
    padding: '0 10px 0 10px',
  }
}))

export default styles
