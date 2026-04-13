import { makeStyles } from 'tss-react/mui'
import { OPACITY } from '@/constants'

interface GluuInputRowStyleParams {
  errorColor: string
  fontColor?: string
}

export const useStyles = makeStyles<GluuInputRowStyleParams>()((
  _theme,
  { errorColor, fontColor },
) => {
  return {
    colWrapper: {
      'position': 'relative',
      '& input:focus, & input:active': {
        outline: 'none',
        boxShadow: 'none',
      },
      '& input:focus-visible': {
        outline: '2px solid currentColor',
        outlineOffset: -2,
        borderRadius: 'inherit',
      },
      '& input:disabled': {
        opacity: OPACITY.PLACEHOLDER,
        cursor: 'not-allowed',
      },
    },
    inputWithShortcode: {
      paddingRight: 44,
    },
    passwordInputWrapper: {
      position: 'relative',
      display: 'block',
      width: '100%',
    },
    passwordInputPadding: {
      paddingRight: 44,
    },
    passwordToggle: {
      'position': 'absolute',
      'right': 20,
      'top': '50%',
      'transform': 'translateY(-50%)',
      'background': 'none',
      'border': 'none',
      'padding': 0,
      'cursor': 'pointer',
      'display': 'flex',
      'alignItems': 'center',
      'color': fontColor ?? 'inherit',
      '&:disabled': {
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
      },
    },
    error: {
      display: 'block',
      color: errorColor,
      fontSize: 12,
      marginTop: 1,
    },

    numberWrapper: {
      'position': 'relative',
      'display': 'flex',
      'alignItems': 'stretch',
      'width': '100%',
      '& input': {
        'flex': 1,
        'paddingRight': 44,
        'MozAppearance': 'textfield',
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
      },
    },
    numberStepper: {
      'position': 'absolute',
      'right': 20,
      'top': '50%',
      'transform': 'translateY(-50%)',
      'display': 'flex',
      'flexDirection': 'column',
      'pointerEvents': 'none',
      '& button': {
        pointerEvents: 'auto',
      },
    },
    numberStepperBtn: {
      'flex': 1,
      'minHeight': 0,
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'color': fontColor ?? 'inherit',
      'cursor': 'pointer',
      'transition': 'none',
      '&:hover:not(:disabled)': {
        backgroundColor: 'transparent',
      },
      '&:disabled': {
        opacity: OPACITY.DISABLED,
        cursor: 'not-allowed',
      },
      '&:first-of-type': {
        borderBottom: 'none',
      },
    },
  }
})
