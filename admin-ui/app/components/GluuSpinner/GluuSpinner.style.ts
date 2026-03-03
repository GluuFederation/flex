import { makeStyles } from 'tss-react/mui'
import { keyframes } from '@emotion/react'
import customColors from '@/customColors'

const SPIN_DURATION = '0.8s'

const spinKeyframes = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

interface GluuSpinnerStyleParams {
  size: number
}

const useStyles = makeStyles<GluuSpinnerStyleParams>()((_, { size }) => ({
  spinner: {
    display: 'block',
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${Math.max(3, Math.floor(size / 12))}px solid transparent`,
    borderTopColor: customColors.logo,
    animation: `${spinKeyframes} ${SPIN_DURATION} linear infinite`,
    willChange: 'transform',
    flexShrink: 0,
  },
}))

export { useStyles }
