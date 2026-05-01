import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import customColors from '@/customColors'
import { fontFamily, fontSizes, fontWeights, lineHeights } from '@/styles/fonts'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { getScrollbarStyles, MODAL, SPACING } from '@/constants'

const WEBHOOK_RESULT_MODAL_MAX_HEIGHT = '76vh'
const WEBHOOK_RESULT_LIST_MAX_HEIGHT = 'min(42vh, 340px)'
const WEBHOOK_RESULT_GAP = SPACING.SECTION_GAP + 2

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { isDark, themeColors }) => {
  const modalBg = themeColors.settings?.cardBackground ?? themeColors.card.background
  const cardBorderStyle = getCardBorderStyle({ isDark })

  return {
    modalContainer: {
      ...cardBorderStyle,
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `min(${MODAL.WIDTH}px, ${MODAL.MAX_VW})`,
      maxWidth: `${MODAL.WIDTH}px`,
      maxHeight: WEBHOOK_RESULT_MODAL_MAX_HEIGHT,
      backgroundColor: modalBg,
      outline: 'none',
      zIndex: 1050,
    },
    contentArea: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.CARD_BUTTON_GAP,
      maxHeight: WEBHOOK_RESULT_MODAL_MAX_HEIGHT,
      padding: SPACING.CONTENT_PADDING,
      overflow: 'hidden',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    },
    title: {
      fontFamily,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight,
      color: themeColors.fontColor,
      margin: 0,
      paddingRight: SPACING.CONTENT_PADDING,
      wordBreak: 'break-word',
    },
    resultList: {
      ...getScrollbarStyles(themeColors),
      display: 'flex',
      flexDirection: 'column',
      gap: WEBHOOK_RESULT_GAP,
      listStyle: 'none',
      paddingLeft: 0,
      paddingRight: SPACING.CARD_CONTENT_GAP,
      margin: 0,
      maxHeight: WEBHOOK_RESULT_LIST_MAX_HEIGHT,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    resultItem: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 0,
      fontSize: fontSizes.md,
      gap: SPACING.CARD_CONTENT_GAP / 2,
    },
    resultLabel: {
      color: themeColors.fontColor,
      fontWeight: fontWeights.medium,
      fontSize: fontSizes.md,
    },
    resultValue: {
      color: themeColors.fontColor,
    },
    successValue: {
      color: customColors.statusActive,
      fontWeight: fontWeights.semiBold,
    },
    failedValue: {
      color: customColors.accentRed,
      fontWeight: fontWeights.semiBold,
    },
    buttonRow: {
      flexShrink: 0,
      paddingTop: 4,
      backgroundColor: modalBg,
      display: 'flex',
      justifyContent: 'flex-start',
      marginTop: 0,
    },
  }
})
