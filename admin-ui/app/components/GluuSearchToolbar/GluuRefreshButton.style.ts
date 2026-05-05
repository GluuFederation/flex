import { makeStyles } from 'tss-react/mui'
import { keyframes } from '@emotion/react'

const spinKeyframes = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

export const useStyles = makeStyles()(() => ({
  icon: {
    display: 'flex',
  },
  iconSpin: {
    animation: `${spinKeyframes} 0.6s linear infinite`,
  },
}))
