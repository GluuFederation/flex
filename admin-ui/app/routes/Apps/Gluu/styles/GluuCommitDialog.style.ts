import { makeStyles } from 'tss-react/mui'
import customColors, { hexToRgb } from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'

interface StylesParams {
  isDark: boolean
}

const OVERLAY_BG_LIGHT = `rgba(${hexToRgb(customColors.black)}, 0.8)`
const OVERLAY_BG_DARK = `rgba(${hexToRgb(customColors.darkCardBg)}, 0.8)`

const MODAL_WIDTH = 1024
const MODAL_HEIGHT = 380
const HORIZONTAL_PADDING = 40
const CONTENT_WIDTH = MODAL_WIDTH - HORIZONTAL_PADDING * 2

export const useStyles = makeStyles<StylesParams>()((_theme, { isDark }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })

  return {
    modalContainer: {
      ...cardBorderStyle,
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: isDark ? customColors.darkCardBg : customColors.white,
      borderRadius: '16px',
      width: `min(${MODAL_WIDTH}px, 90vw)`,
      maxWidth: `${MODAL_WIDTH}px`,
      height: `min(${MODAL_HEIGHT}px, 90vh)`,
      maxHeight: `${MODAL_HEIGHT}px`,
      zIndex: 1050,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'visible',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: isDark ? OVERLAY_BG_DARK : OVERLAY_BG_LIGHT,
      zIndex: 1040,
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      margin: 0,
    },
    title: {
      fontFamily,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes['2xl'],
      lineHeight: '32px',
      color: isDark ? customColors.white : customColors.primaryDark,
      marginTop: '24px',
      marginBottom: '16px',
      marginLeft: `${HORIZONTAL_PADDING}px`,
      marginRight: `${HORIZONTAL_PADDING}px`,
      paddingLeft: 0,
      textAlign: 'left',
      width: `calc(100% - ${HORIZONTAL_PADDING * 2}px)`,
      maxWidth: '100%',
      position: 'relative',
      zIndex: 1,
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
    closeButton: {
      'position': 'absolute',
      'top': '12px',
      'right': '12px',
      'width': '56px',
      'height': '40px',
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'color': isDark ? customColors.white : customColors.primaryDark,
      '&:hover': {
        opacity: 0.5,
      },
    },
    textareaContainer: {
      position: 'absolute',
      top: '88px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `min(${CONTENT_WIDTH}px, calc(100% - ${HORIZONTAL_PADDING * 2}px))`,
      maxWidth: `${CONTENT_WIDTH}px`,
      height: '160px',
      backgroundColor: isDark ? customColors.darkInputBg : customColors.lightBackground,
      border: isDark
        ? `1px solid ${customColors.darkBorder}`
        : `1px solid ${customColors.borderInput}`,
      borderRadius: '6px',
      padding: 0,
      boxSizing: 'border-box',
      marginBottom: 0,
    },
    textarea: {
      'width': '100%',
      'height': '100%',
      'padding': '14px 21px',
      'backgroundColor': 'transparent',
      'border': 'none',
      'borderRadius': '6px',
      fontFamily,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      'lineHeight': lineHeights.relaxed,
      'color': isDark ? customColors.white : customColors.primaryDark,
      'resize': 'none',
      'outline': 'none',
      'boxSizing': 'border-box',
      '&::placeholder': {
        color: isDark ? customColors.textMutedDark : customColors.textSecondary,
        opacity: 1,
      },
    },
    errorMessage: {
      position: 'absolute',
      top: '245px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `min(${CONTENT_WIDTH}px, calc(100% - ${HORIZONTAL_PADDING * 2}px))`,
      maxWidth: `${CONTENT_WIDTH}px`,
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.relaxed,
      margin: 0,
      marginTop: '2px',
      zIndex: 2,
    },
    yesButton: {
      position: 'absolute',
      bottom: '48px',
      left: `${HORIZONTAL_PADDING}px`,
      zIndex: 3,
      padding: '8px 28px',
    },
  }
})
