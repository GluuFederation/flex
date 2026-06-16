import { makeStyles } from 'tss-react/mui'

interface GluuRemovableInputRowStyleParams {
  fontColor?: string
  isDark?: boolean
}

export const useStyles = makeStyles<GluuRemovableInputRowStyleParams>()(
  (_theme, { fontColor, isDark }) => ({
    removeButton: {
      width: 32,
      height: 32,
      minWidth: 32,
      minHeight: 32,
      padding: 6,
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    removeIcon: {
      color: fontColor,
      fontSize: 16,
    },
    booleanRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    booleanRemoveWrapper: {
      marginLeft: 'auto',
    },
    inputWrapper: {
      width: '100%',
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    input: {
      'flex': 1,
      'minWidth': 0,
      '&::-webkit-calendar-picker-indicator': {
        filter: isDark ? 'brightness(0) invert(1)' : 'none',
        cursor: 'pointer',
      },
    },
  }),
)
