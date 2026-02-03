import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'

const TRACK_COLOR_DARK = `rgba(${hexToRgb(customColors.white)}, 0.12)`
const TRACK_COLOR_LIGHT = `rgba(${hexToRgb(customColors.black)}, 0.08)`

interface GluuSpinnerStyleParams {
  size: number
  isDark: boolean
}

const useStyles = makeStyles<GluuSpinnerStyleParams>()((_, { size, isDark }) => ({
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  'spinner': {
    display: 'block',
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${Math.max(3, Math.floor(size / 12))}px solid ${
      isDark ? TRACK_COLOR_DARK : TRACK_COLOR_LIGHT
    }`,
    borderTopColor: customColors.logo,
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
}))

export { useStyles }
