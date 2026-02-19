import { makeStyles } from 'tss-react/mui'
import { keyframes } from '@emotion/react'
import customColors, { hexToRgb } from '@/customColors'

const TRACK_COLOR_DARK = `rgba(${hexToRgb(customColors.white)}, 0.12)`
const TRACK_COLOR_LIGHT = `rgba(${hexToRgb(customColors.black)}, 0.08)`

const SPIN_DURATION = '0.8s'

const spinKeyframes = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

interface GluuSpinnerStyleParams {
  size: number
  isDark: boolean
}

const useStyles = makeStyles<GluuSpinnerStyleParams>()((_, { size, isDark }) => ({
  spinner: {
    display: 'block',
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${Math.max(3, Math.floor(size / 12))}px solid ${
      isDark ? TRACK_COLOR_DARK : TRACK_COLOR_LIGHT
    }`,
    borderTopColor: customColors.logo,
    animation: `${spinKeyframes} ${SPIN_DURATION} linear infinite`,
    willChange: 'transform',
    flexShrink: 0,
  },
}))

export { useStyles }
