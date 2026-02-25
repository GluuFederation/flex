import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import applicationStyle from './applicationStyle'

const MODAL_MIN_WIDTH = '60vw'
const HEADER_PADDING = '16px'
const BODY_MAX_HEIGHT = '60vh'
const ERROR_FONT_SIZE = 12
const HOVER_OPACITY = 0.85

export const getModalStyle = (_themeColors: ThemeConfig) => ({
  minWidth: MODAL_MIN_WIDTH,
  border: 'none',
  outline: 'none',
})

export const useStyles = makeStyles<{ themeColors: ThemeConfig }>()((_theme, { themeColors }) => ({
  modalWrapper: {
    'display': 'flex !important',
    'alignItems': 'center',
    'justifyContent': 'center',
    'border': 'none',
    'outline': 'none',
    '& .modal-dialog': {
      margin: 0,
      border: 'none',
      outline: 'none',
    },
    '& .modal-content': {
      border: 'none',
      outline: 'none',
    },
  },
  buttonHoverOpacity: {
    '&:hover': { opacity: HOVER_OPACITY },
    '&:focus': { opacity: HOVER_OPACITY },
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
    'minWidth': 'unset',
    'minHeight': 'unset',
    'padding': '6px 10px',
    'fontSize': '2rem !important',
    '&:hover': { opacity: HOVER_OPACITY },
    '&:focus': { opacity: HOVER_OPACITY },
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
}))

export const getFooterButtonStyles = (themeColors: ThemeConfig) => ({
  cancelButtonStyle: {
    backgroundColor: themeColors.formFooter.cancel.backgroundColor,
    color: themeColors.formFooter.cancel.textColor,
    border: `1px solid ${themeColors.formFooter.cancel.borderColor}`,
    ...applicationStyle.buttonFlexIconStyles,
  },
  applyButtonStyle: {
    ...applicationStyle.buttonStyle,
    ...applicationStyle.buttonFlexIconStyles,
  },
})
