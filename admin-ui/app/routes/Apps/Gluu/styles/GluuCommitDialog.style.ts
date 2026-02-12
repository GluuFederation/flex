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
const MODAL_HEIGHT = 420
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
      display: 'flex',
      flexDirection: 'column',
    },
    contentArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: `24px ${HORIZONTAL_PADDING}px ${HORIZONTAL_PADDING}px`,
      paddingTop: 56,
      overflowY: 'auto',
      gap: 8,
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
      margin: 0,
      paddingLeft: 0,
      textAlign: 'left',
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
      width: '100%',
      maxWidth: `${CONTENT_WIDTH}px`,
      height: '120px',
      flexShrink: 0,
      backgroundColor: isDark ? customColors.darkInputBg : customColors.lightBackground,
      border: isDark
        ? `1px solid ${customColors.darkBorder}`
        : `1px solid ${customColors.borderInput}`,
      borderRadius: '6px',
      padding: 0,
      boxSizing: 'border-box',
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
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.base,
      lineHeight: lineHeights.relaxed,
      margin: 0,
    },
    buttonRow: {
      marginTop: 'auto',
      paddingTop: 8,
    },
    yesButton: {
      padding: '8px 28px',
    },
  }
})
