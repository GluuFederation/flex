import { makeStyles } from 'tss-react/mui'
import { ICON_SIZE, OPACITY } from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'

const SECRET_GAP = 8

export const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((_, { themeColors }) => ({
  secretRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: SECRET_GAP,
    minWidth: 0,
  },
  secretText: {
    wordBreak: 'break-all',
  },
  secretToggle: {
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'padding': 0,
    'border': 'none',
    'background': 'none',
    'cursor': 'pointer',
    'color': themeColors.fontColor,
    'flexShrink': 0,
    '& svg': {
      fontSize: ICON_SIZE.MD,
    },
    '&:hover': {
      opacity: OPACITY.OVERLAY,
    },
  },
}))
