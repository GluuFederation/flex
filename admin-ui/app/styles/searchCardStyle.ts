import { BORDER_RADIUS, SPACING } from '@/constants'
import { getCardBorderStyle } from './cardBorderStyles'

const SEARCH_CARD_PADDING_VERTICAL = SPACING.PAGE
const SEARCH_CARD_PADDING_HORIZONTAL = 20
const SEARCH_CARD_MARGIN_BOTTOM = SPACING.CARD_GAP

export type SearchCardStyleParams = {
  cardBg: string
  isDark: boolean
}

export const createSearchCardStyle = ({ cardBg, isDark }: SearchCardStyleParams) => ({
  width: '100%',
  backgroundColor: cardBg,
  ...getCardBorderStyle({ isDark, borderRadius: BORDER_RADIUS.DEFAULT }),
  borderRadius: BORDER_RADIUS.DEFAULT,
  padding: `${SEARCH_CARD_PADDING_VERTICAL}px ${SEARCH_CARD_PADDING_HORIZONTAL}px`,
  marginBottom: `${SEARCH_CARD_MARGIN_BOTTOM}px`,
  boxSizing: 'border-box' as const,
  position: 'relative' as const,
  zIndex: 0,
  overflow: 'visible' as const,
})
