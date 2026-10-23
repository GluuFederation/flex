import { createFormCardStyles } from '../formStyles'
import { SPACING } from '@/constants'

const CARD_BG = '#123456'

describe('createFormCardStyles', () => {
  it('pads the card content with the card padding', () => {
    const { content } = createFormCardStyles({ isDark: false, cardBg: CARD_BG })
    expect(content.padding).toBe(SPACING.CARD_PADDING)
  })

  it('uses the card background it is given', () => {
    const { formCard } = createFormCardStyles({ isDark: false, cardBg: CARD_BG })
    expect(formCard.backgroundColor).toBe(CARD_BG)
  })

  it('draws the gradient border in dark mode', () => {
    const { formCard } = createFormCardStyles({ isDark: true, cardBg: CARD_BG })
    expect(formCard).toHaveProperty('&::before')
  })

  it('uses a shadow instead of the gradient border in light mode', () => {
    const { formCard } = createFormCardStyles({ isDark: false, cardBg: CARD_BG })
    expect(formCard).not.toHaveProperty('&::before')
    expect(formCard).toHaveProperty('boxShadow')
  })
})
