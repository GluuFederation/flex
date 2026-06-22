import { makeStyles } from 'tss-react/mui'
import { keyframes } from '@emotion/react'
import { BORDER_RADIUS, OPACITY } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { fontFamily, fontWeights } from '@/styles/fonts'
import type { ToastType } from '@/redux/types'
import customColors from '@/customColors'

const VIEWPORT_Z_INDEX = 1400
const TOAST_WIDTH = 320
const TOAST_MIN_HEIGHT = 72
const TOAST_ICON_SIZE = 26
const PROGRESS_HEIGHT = 5
const ENTER_DURATION = '300ms'
const EXIT_DURATION = '300ms'

export const TOAST_TYPE_COLOR: Record<ToastType, string> = {
  success: customColors.statusActive,
  error: customColors.statusInactive,
  warning: customColors.orange,
  info: customColors.lightBlue,
}

export const useStyles = makeStyles()(() => ({
  container: {
    'position': 'fixed',
    'top': 16,
    'right': 16,
    'zIndex': VIEWPORT_Z_INDEX,
    'display': 'flex',
    'flexDirection': 'column',
    'gap': 8,
    'width': TOAST_WIDTH,
    'maxWidth': 'calc(100vw - 32px)',
    'pointerEvents': 'none',
    '&[data-paused] [data-toast-progress]': {
      animationPlayState: 'paused',
    },
  },
  toast: {
    ...getCardBorderStyle({ isDark: false, borderRadius: BORDER_RADIUS.SMALL }),
    'borderRadius': BORDER_RADIUS.SMALL,
    'boxSizing': 'border-box',
    'pointerEvents': 'auto',
    'position': 'relative',
    'overflow': 'hidden',
    'display': 'flex',
    'alignItems': 'center',
    'gap': 10,
    'minHeight': TOAST_MIN_HEIGHT,
    'padding': '12px 40px 12px 16px',
    'backgroundColor': customColors.white,
    'color': customColors.textMutedDark,
    fontFamily,
    'fontWeight': fontWeights.regular,
    'wordBreak': 'break-word',
    'animation': `${keyframes({
      from: { transform: 'translateX(120%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    })} ${ENTER_DURATION} ease`,
    '&:hover [data-toast-progress]': {
      animationPlayState: 'paused',
    },
  },
  toastExiting: {
    animation: `${keyframes({
      from: { transform: 'translateX(0)', opacity: 1 },
      to: { transform: 'translateX(120%)', opacity: 0 },
    })} ${EXIT_DURATION} ease forwards`,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
  },
  icon: {
    flexShrink: 0,
    fontSize: TOAST_ICON_SIZE,
  },
  content: {
    flex: 1,
    minWidth: 0,
    lineHeight: 1.4,
    textAlign: 'left',
  },
  title: {
    fontWeight: fontWeights.semiBold,
    color: customColors.nearBlack,
  },
  closeButton: {
    'position': 'absolute',
    'top': 8,
    'right': 8,
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'padding': 0,
    'width': 20,
    'height': 20,
    'border': 'none',
    'background': 'transparent',
    'color': customColors.textMutedDark,
    'cursor': 'pointer',
    'lineHeight': 1,
    'opacity': OPACITY.OVERLAY,
    '&:hover': {
      opacity: OPACITY.FULL,
    },
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: PROGRESS_HEIGHT,
    transformOrigin: 'left',
    animationName: keyframes({
      from: { transform: 'scaleX(1)' },
      to: { transform: 'scaleX(0)' },
    }),
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
  },
}))
