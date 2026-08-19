import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, MODAL } from '@/constants'

// This dialog carries one short message, so it is sized for reading rather than reusing the
// commit dialog's form geometry, which is roughly twice as wide as this content needs.
const TIMEOUT_MODAL_WIDTH = 480
const CONTENT_PADDING = 32
const MOBILE_CONTENT_PADDING = 24
const CONTENT_GAP = 12
const TITLE_BOTTOM_SPACING = 12
const ACTIONS_SPACING = 16
const CLOSE_BUTTON_SIZE = 32
const CLOSE_BUTTON_OFFSET = 12

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { isDark, themeColors }) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const modalBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    modalContainer: {
      ...cardBorderStyle,
      position: 'relative',
      margin: 'auto',
      backgroundColor: modalBg,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: `min(${TIMEOUT_MODAL_WIDTH}px, ${MODAL.MAX_VW})`,
      display: 'flex',
      flexDirection: 'column',
      gap: CONTENT_GAP,
      padding: CONTENT_PADDING,
      boxSizing: 'border-box',
      [`@media ${MOBILE_MEDIA_QUERY}`]: {
        borderRadius: BORDER_RADIUS.MEDIUM_SMALL,
        padding: MOBILE_CONTENT_PADDING,
      },
    },
    closeButton: {
      position: 'absolute',
      top: CLOSE_BUTTON_OFFSET,
      right: CLOSE_BUTTON_OFFSET,
      width: CLOSE_BUTTON_SIZE,
      height: CLOSE_BUTTON_SIZE,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      border: 'none',
      background: 'transparent',
      borderRadius: BORDER_RADIUS.SMALL,
      color: themeColors.fontColor,
      cursor: 'pointer',
    },
    title: {
      fontFamily,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.relaxed,
      color: themeColors.fontColor,
      margin: 0,
      // Without this the heading sits only a container gap from the body, which is barely more
      // than the body's own line spacing, so the two read as one paragraph instead of a heading.
      marginBottom: TITLE_BOTTOM_SPACING,
      // Keeps the heading clear of the close button rather than running underneath it.
      paddingRight: CLOSE_BUTTON_SIZE,
    },
    description: {
      color: themeColors.fontColor,
      fontSize: fontSizes.md,
      lineHeight: lineHeights.base,
      margin: 0,
    },
    // The shared footer already aligns its button left; only its outer spacing is trimmed so the
    // dialog relies on the container gap instead of form-sized section margins.
    actions: {
      marginTop: ACTIONS_SPACING,
      paddingTop: 0,
      paddingBottom: 0,
    },
  }
})
