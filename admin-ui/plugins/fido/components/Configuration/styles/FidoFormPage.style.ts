import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'

type FidoFormPageStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const FORM_CARD_MIN_HEIGHT = 400
const CONTENT_HORIZONTAL_PADDING = 52

export const useStyles = makeStyles<FidoFormPageStylesParams>()((
  _theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: WIDTH_FULL,
      minHeight: FORM_CARD_MIN_HEIGHT,
      position: 'relative' as const,
      overflow: 'visible' as const,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      boxSizing: BOX_SIZING_BORDER,
    },
    content: {
      paddingTop: SPACING.PAGE,
      paddingLeft: CONTENT_HORIZONTAL_PADDING,
      paddingRight: CONTENT_HORIZONTAL_PADDING,
      paddingBottom: SPACING.CONTENT_PADDING,
      width: WIDTH_FULL,
      boxSizing: BOX_SIZING_BORDER,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN,
      gap: 0,
    },
  }
})
