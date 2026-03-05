import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { getHoverOpacity } from '@/constants'
import applicationStyle from './applicationStyle'

const MODAL_MIN_WIDTH = '60vw'
const HEADER_PADDING = '16px'
const BODY_MAX_HEIGHT = '60vh'
const ERROR_FONT_SIZE = 12

export const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((theme, { themeColors }) => {
  const isDark = theme.palette.mode === 'dark'
  const hoverOpacity = getHoverOpacity(isDark)

  return {
    modalWrapper: {
      'display': 'flex !important',
      'alignItems': 'center',
      'justifyContent': 'center',
      'border': 'none',
      'outline': 'none',
      '& .modal-dialog': {
        minWidth: MODAL_MIN_WIDTH,
        maxWidth: MODAL_MIN_WIDTH,
        margin: '0 auto',
        border: 'none',
        outline: 'none',
      },
      '& .modal-content': {
        minWidth: MODAL_MIN_WIDTH,
        border: 'none',
        outline: 'none',
        backgroundColor: themeColors.card.background,
      },
      '& .modal-body': {
        backgroundColor: themeColors.card.background,
      },
    },
    buttonHoverOpacity: {
      '&:hover': { opacity: 1 - hoverOpacity },
      '&:focus': { opacity: 1 - hoverOpacity },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: HEADER_PADDING,
      backgroundColor: themeColors.card.background,
      color: themeColors.fontColor,
      border: 'none',
      borderBottom: 'none',
    },
    titleText: {
      color: themeColors.fontColor,
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    closeButton: {
      minWidth: 'unset',
      minHeight: 'unset',
      padding: '6px 10px',
      fontSize: '2rem !important',
    },
    body: {
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: BODY_MAX_HEIGHT,
      backgroundColor: themeColors.card.background,
      color: themeColors.fontColor,
      fontFamily: 'monospace',
      fontSize: ERROR_FONT_SIZE,
      border: 'none',
    },
    footer: {
      padding: '16px',
      backgroundColor: themeColors.card.background,
      border: 'none',
      borderTop: 'none',
    },
    errorText: {
      color: themeColors.fontColor,
      fontFamily: 'monospace',
      fontSize: ERROR_FONT_SIZE,
    },
    cancelButton: {
      'backgroundColor': themeColors.formFooter.cancel.backgroundColor,
      'color': '#fff !important',
      'border': 'none',
      ...applicationStyle.buttonFlexIconStyles,
      '&:hover': { opacity: 1 - hoverOpacity, color: '#fff !important' },
      '&:focus': { opacity: 1 - hoverOpacity, color: '#fff !important' },
      '&:active': { color: '#fff !important' },
      '& i': { color: '#fff !important' },
    },
    applyButton: {
      ...applicationStyle.buttonStyle,
      ...applicationStyle.buttonFlexIconStyles,
      'color': '#fff !important',
      '&:hover': { opacity: 1 - hoverOpacity, color: '#fff !important' },
      '&:focus': { opacity: 1 - hoverOpacity, color: '#fff !important' },
      '&:active': { color: '#fff !important' },
      '& i': { color: '#fff !important' },
    },
  }
})
