import { makeStyles } from 'tss-react/mui'
import customColors, { getLoadingOverlayRgba } from '@/customColors'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import {
  BORDER_RADIUS,
  CEDARLING_CONFIG_SPACING,
  MAPPING_SPACING,
  MODAL,
  OPACITY,
} from '@/constants'
import type { ThemeConfig } from '@/context/theme/config'

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

const OVERLAY_BG_LIGHT = getLoadingOverlayRgba(customColors.black, 0.8)
const OVERLAY_BG_DARK = getLoadingOverlayRgba(customColors.darkCardBg, 0.8)

const CONTENT_WIDTH = 898
const CONTENT_GAP = 16
const TITLE_BOTTOM_SPACING = 24
const TEXTAREA_HEIGHT = 161
const OPERATIONS_MAX_HEIGHT = 240
const CLOSE_BUTTON_SIZE = 32
const CLOSE_BUTTON_OFFSET = 16
const BUTTON_MIN_HEIGHT = '40px'
const BUTTON_PADDING = '8px 28px'

const CONTENT_BUTTONS_PADDING = CEDARLING_CONFIG_SPACING.BUTTONS_MT + 5
const CHECKBOX_LABEL_GAP_ADJUST = MAPPING_SPACING.CHECKBOX_LABEL_GAP - 1
const BORDER_RADIUS_SMALL_ADJUST = BORDER_RADIUS.SMALL - 2
const CHECKBOX_LABEL_GAP_PLUS = MAPPING_SPACING.CHECKBOX_LABEL_GAP + 3

export const useStyles = makeStyles<StylesParams>()((_theme, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const modalBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    modalContainer: {
      ...cardBorderStyle,
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: modalBg,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: `min(${MODAL.WIDTH}px, ${MODAL.MAX_VW})`,
      maxWidth: `${MODAL.WIDTH}px`,
      maxHeight: MODAL.MAX_VH,
      zIndex: 1050,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'visible',
    },
    contentArea: {
      display: 'flex',
      flexDirection: 'column',
      padding: `${CONTENT_BUTTONS_PADDING}px`,
      gap: CONTENT_GAP,
      overflowY: 'auto',
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
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.XXXLoose,
      color: themeColors.fontColor,
      margin: 0,
      paddingBottom: TITLE_BOTTOM_SPACING,
      paddingLeft: 0,
      textAlign: 'left',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
    closeButton: {
      'position': 'absolute',
      'top': `${CLOSE_BUTTON_OFFSET}px`,
      'right': `${CLOSE_BUTTON_OFFSET}px`,
      'width': `${CLOSE_BUTTON_SIZE}px`,
      'height': `${CLOSE_BUTTON_SIZE}px`,
      'minHeight': `${CLOSE_BUTTON_SIZE}px`,
      'padding': 0,
      'border': 'none',
      'background': 'transparent',
      'cursor': 'pointer',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'fontSize': fontSizes.content,
      'lineHeight': 1,
      'color': themeColors.fontColor,
      'borderRadius': '50%',
      '& i': {
        fontSize: 'inherit',
        lineHeight: 1,
      },
      '&:hover': {
        opacity: 1 - OPACITY.DISABLED,
      },
    },
    textareaContainer: {
      width: '100%',
      maxWidth: `${CONTENT_WIDTH}px`,
      height: `${TEXTAREA_HEIGHT}px`,
      flexShrink: 0,
      backgroundColor: themeColors.inputBackground,
      border: `1px solid ${themeColors.borderColor}`,
      borderRadius: BORDER_RADIUS.SMALL,
      padding: 0,
      boxSizing: 'border-box',
    },
    textarea: {
      'width': '100%',
      'height': '100%',
      'padding': '14px 21px',
      'backgroundColor': 'transparent',
      'border': 'none',
      'borderRadius': BORDER_RADIUS.SMALL,
      fontFamily,
      'fontSize': fontSizes.base,
      'fontWeight': fontWeights.medium,
      'lineHeight': lineHeights.relaxed,
      'color': themeColors.fontColor,
      'resize': 'none',
      'outline': 'none',
      'boxSizing': 'border-box',
      '&::placeholder': {
        color: themeColors.textMuted,
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
    operationsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: CHECKBOX_LABEL_GAP_ADJUST,
      maxHeight: OPERATIONS_MAX_HEIGHT,
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '80%',
      alignSelf: 'flex-start',
    },
    operationsTitle: {
      fontFamily,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.normal,
      color: themeColors.fontColor,
      margin: `0 0 ${CHECKBOX_LABEL_GAP_ADJUST}px 0`,
    },
    operationRow: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto 2fr',
      alignItems: 'start',
      columnGap: 12,
      paddingBottom: 4,
    },
    operationLabel: {
      fontFamily,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.md,
      color: themeColors.fontColor,
      textAlign: 'center',
      whiteSpace: 'nowrap' as const,
    },
    operationBadge: {
      fontFamily,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      backgroundColor: themeColors.fontColor,
      color: themeColors.card.background,
      borderRadius: BORDER_RADIUS_SMALL_ADJUST,
      padding: '4px 10px',
      width: 'fit-content',
      maxWidth: '100%',
      overflowWrap: 'break-word' as const,
      wordBreak: 'break-word' as const,
      whiteSpace: 'normal' as const,
    },
    buttonRow: {
      display: 'flex',
      alignItems: 'center',
      gap: CHECKBOX_LABEL_GAP_PLUS,
    },
    yesButton: {
      minHeight: BUTTON_MIN_HEIGHT,
      padding: BUTTON_PADDING,
    },
    noButton: {
      minHeight: BUTTON_MIN_HEIGHT,
      padding: BUTTON_PADDING,
    },
  }
})
