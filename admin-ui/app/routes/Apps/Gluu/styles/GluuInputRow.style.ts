import { makeStyles } from 'tss-react/mui'

interface GluuInputRowStyleParams {
  errorColor: string
}

export const useStyles = makeStyles<GluuInputRowStyleParams>()((_theme, { errorColor }) => ({
  colWrapper: {
    position: 'relative',
  },
  inputWithShortcode: {
    paddingRight: 44,
  },
  passwordToggle: {
    position: 'absolute',
    right: 20,
    top: 7,
  },
  error: {
    color: errorColor,
  },
}))
