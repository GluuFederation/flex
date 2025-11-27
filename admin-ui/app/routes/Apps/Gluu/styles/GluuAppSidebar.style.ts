import customColors from '@/customColors'
import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()({
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(8px)',
    },
    '100%': {
      opacity: 1,
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
  'waveContainer': {
    position: 'relative',
    bottom: 93,
    left: 0,
    top: 140,
    height: 70,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  'wave': {
    position: 'relative',
    top: -75,
  },
  'powered': {
    color: customColors.white,
    textAlign: 'center',
    position: 'relative',
    top: -130,
    fontWeight: 500,
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
