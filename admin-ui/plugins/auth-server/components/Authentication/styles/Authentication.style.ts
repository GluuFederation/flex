import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { SPACING, BORDER_RADIUS, ICON_SIZE } from '@/constants'
import { getCardBorderStyle } from '@/styles/cardBorderStyles'
import type { ThemeConfig } from '@/context/theme/config'

type AuthenticationStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

const WIDTH_FULL = '100%'
const BOX_SIZING_BORDER = 'border-box'
const DISPLAY_FLEX = 'flex'
const FLEX_DIRECTION_COLUMN = 'column'
const FORM_CARD_MIN_HEIGHT = 400
const CONTENT_HORIZONTAL_PADDING = 52
const CONTENT_HORIZONTAL_PADDING_MOBILE = 20
const MOBILE_BREAKPOINT = 768

export const useStyles = makeStyles<AuthenticationStylesParams>()((
  _theme: Theme,
  { isDark, themeColors },
) => {
  const cardBorderStyle = getCardBorderStyle({ isDark })
  const cardBg = themeColors.settings?.cardBackground ?? themeColors.card.background

  return {
    addIcon: { fontSize: ICON_SIZE.MD },
    formCard: {
      backgroundColor: cardBg,
      ...cardBorderStyle,
      borderRadius: BORDER_RADIUS.DEFAULT,
      width: WIDTH_FULL,
      minHeight: FORM_CARD_MIN_HEIGHT,
      position: 'relative' as const,
      overflow: 'visible' as const,
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN as 'column',
      boxSizing: BOX_SIZING_BORDER as 'border-box',
    },
    content: {
      paddingTop: SPACING.PAGE,
      paddingLeft: CONTENT_HORIZONTAL_PADDING,
      paddingRight: CONTENT_HORIZONTAL_PADDING,
      paddingBottom: SPACING.CONTENT_PADDING,
      width: WIDTH_FULL,
      maxWidth: WIDTH_FULL,
      minWidth: 0,
      boxSizing: BOX_SIZING_BORDER as 'border-box',
      display: DISPLAY_FLEX,
      flexDirection: FLEX_DIRECTION_COLUMN as 'column',
      gap: 0,
      overflow: 'visible',
      [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
        paddingLeft: CONTENT_HORIZONTAL_PADDING_MOBILE,
        paddingRight: CONTENT_HORIZONTAL_PADDING_MOBILE,
      },
    },
  }
})
