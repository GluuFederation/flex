import { makeStyles } from 'tss-react/mui'
import type { ThemeConfig } from '@/context/theme/config'
import { fontSizes, lineHeights } from '@/styles/fonts'
import { MODAL } from '@/constants'

const TIMEOUT_MODAL_WIDTH = 680

interface StylesParams {
  isDark: boolean
  themeColors: ThemeConfig
}

export const useStyles = makeStyles<StylesParams>()((_theme, { themeColors }) => {
  return {
    modalContainer: {
      width: `min(${TIMEOUT_MODAL_WIDTH}px, ${MODAL.MAX_VW})`,
      maxWidth: `${TIMEOUT_MODAL_WIDTH}px`,
    },
    description: {
      color: themeColors.fontColor,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.relaxed,
      margin: 0,
    },
  }
})
