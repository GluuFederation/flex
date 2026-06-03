import { makeStyles } from 'tss-react/mui'
import { OPACITY } from '@/constants'

const styles = makeStyles()({
  '@keyframes fadeInUp': {
    '0%': {
      opacity: OPACITY.NONE,
      transform: 'translateY(8px)',
    },
    '100%': {
      opacity: OPACITY.FULL,
      transform: 'translateY(0)',
    },
  },
  'menuFadeIn': {
    animation: 'fadeInUp 260ms ease-out both',
  },
  'menuContainer': {
    position: 'relative',
    minHeight: 80,
  },
  'loaderOverlay': {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    background: 'transparent',
  },
  'loaderRoot': {
    width: '100%',
    minHeight: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'waveFadeIn': {
    animation: 'fadeInUp 360ms ease-out both',
    animationDelay: '80ms',
  },
  'waveContainerFixed': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    background: 'inherit',
  },
})

export default styles
