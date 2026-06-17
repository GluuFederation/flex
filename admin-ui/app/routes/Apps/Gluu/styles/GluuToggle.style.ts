import { makeStyles } from 'tss-react/mui'
import { OPACITY, TOGGLE, BORDER_RADIUS } from '@/constants'
import customColors from '@/customColors'

const TRACK_DEFAULT = customColors.sidebarHoverBg
const TRACK_CHECKED = customColors.statusActive
const THUMB_BG = customColors.whiteSmoke
const FOCUS_COLOR = customColors.lightBlue

export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: 'inline-block',
    flex: '0 0 auto',
    width: TOGGLE.TRACK_WIDTH,
    height: TOGGLE.TRACK_HEIGHT,
    lineHeight: 0,
    verticalAlign: 'middle',
  },
  root: {
    'touchAction': 'pan-x',
    'display': 'inline-block',
    'position': 'relative',
    'cursor': 'pointer',
    'backgroundColor': 'transparent',
    'border': 0,
    'padding': 0,
    'margin': 0,
    'userSelect': 'none',
    'WebkitTapHighlightColor': 'transparent',
    '&.react-toggle--disabled': {
      cursor: 'not-allowed',
      opacity: OPACITY.DISABLED,
      transition: 'opacity 0.25s',
    },
    '& .react-toggle-screenreader-only': {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: 1,
    },
    '& .react-toggle-track': {
      position: 'relative',
      width: TOGGLE.TRACK_WIDTH,
      height: TOGGLE.TRACK_HEIGHT,
      padding: 0,
      borderRadius: TOGGLE.TRACK_RADIUS,
      backgroundColor: TRACK_DEFAULT,
      transition: 'all 0.2s ease',
    },
    '&.react-toggle--checked .react-toggle-track': {
      backgroundColor: TRACK_CHECKED,
    },
    '& .react-toggle-track-check, & .react-toggle-track-x': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      marginTop: 'auto',
      marginBottom: 'auto',
      lineHeight: 0,
      transition: 'opacity 0.25s ease',
    },
    '& .react-toggle-track-check': {
      width: TOGGLE.CHECK_WIDTH,
      height: TOGGLE.ICON_HEIGHT,
      left: TOGGLE.CHECK_LEFT,
      opacity: OPACITY.NONE,
    },
    '&.react-toggle--checked .react-toggle-track-check': {
      opacity: OPACITY.FULL,
    },
    '& .react-toggle-track-x': {
      width: TOGGLE.X_WIDTH,
      height: TOGGLE.ICON_HEIGHT,
      right: TOGGLE.X_RIGHT,
      opacity: OPACITY.FULL,
    },
    '&.react-toggle--checked .react-toggle-track-x': {
      opacity: OPACITY.NONE,
    },
    '& .react-toggle-thumb': {
      position: 'absolute',
      top: TOGGLE.THUMB_INSET,
      left: TOGGLE.THUMB_INSET,
      width: TOGGLE.THUMB_SIZE,
      height: TOGGLE.THUMB_SIZE,
      border: `${TOGGLE.THUMB_INSET}px solid ${TRACK_DEFAULT}`,
      borderRadius: BORDER_RADIUS.CIRCLE,
      backgroundColor: THUMB_BG,
      boxSizing: 'border-box',
      transition: 'all 0.25s ease',
    },
    '&.react-toggle--checked .react-toggle-thumb': {
      left: TOGGLE.THUMB_CHECKED_LEFT,
    },
    '&.react-toggle--focus .react-toggle-thumb': {
      boxShadow: `0 0 ${TOGGLE.FOCUS_RING_BLUR}px ${TOGGLE.FOCUS_RING_SPREAD}px ${FOCUS_COLOR}`,
    },
    '&:active:not(.react-toggle--disabled) .react-toggle-thumb': {
      boxShadow: `0 0 ${TOGGLE.ACTIVE_RING_BLUR}px ${TOGGLE.ACTIVE_RING_SPREAD}px ${FOCUS_COLOR}`,
    },
  },
}))
