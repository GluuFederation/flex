import { makeStyles } from 'tss-react/mui'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import { BORDER_RADIUS, MODAL } from '@/constants'
import { fontFamily, fontWeights, fontSizes, lineHeights } from '@/styles/fonts'
import type { ThemeConfig } from '@/context/theme/config'

type StylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const VIEW_MODAL_WIDTH = '70vw'

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
      width: `min(${VIEW_MODAL_WIDTH}, ${MODAL.MAX_VW})`,
      maxWidth: VIEW_MODAL_WIDTH,
      height: 'auto',
      flexShrink: 0,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 24px',
      paddingRight: 56,
      fontFamily,
      fontWeight: fontWeights.bold,
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.normal,
      color: themeColors.fontColor,
    },
    content: {
      padding: '0 24px 8px',
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: '60vh',
      color: themeColors.fontColor,
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '12px 24px 20px',
    },
  }
})
