import { makeStyles } from 'tss-react/mui'
import customColors from '@/customColors'

interface GluuSelectRowStyleParams {
  fontColor: string
}

export const useStyles = makeStyles<GluuSelectRowStyleParams>()((_theme, { fontColor }) => ({
  colWrapper: {
    position: 'relative',
  },
  selectWrapper: {
    position: 'relative',
  },
  select: {
    'paddingRight': '44px !important',
    'WebkitAppearance': 'none',
    'MozAppearance': 'none',
    'appearance': 'none',
    'backgroundImage': 'none !important',
    '&:focus': {
      backgroundImage: 'none !important',
    },
  },
  chevronWrapper: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: fontColor,
    zIndex: 6,
  },
  error: {
    display: 'block',
    color: customColors.accentRed,
    marginTop: 4,
    fontSize: 12,
  },
}))
