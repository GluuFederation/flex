import { resolveBackgroundColor } from '@/utils/buttonUtils'

const BG = '#123456'
const HOVER = '#abcdef'

describe('resolveBackgroundColor', () => {
  it('returns the base background when hover styles are disabled', () => {
    expect(resolveBackgroundColor(true, false, false, true, false, BG, HOVER)).toBe(BG)
  })

  it('returns the base background when the background should be kept on hover', () => {
    expect(resolveBackgroundColor(false, true, false, true, false, BG, HOVER)).toBe(BG)
  })

  it('returns a translucent tint for an outlined button hovered while enabled', () => {
    expect(resolveBackgroundColor(false, false, true, true, false, BG, HOVER)).toBe(`${BG}15`)
  })

  it('returns transparent for an outlined button that is not hovered', () => {
    expect(resolveBackgroundColor(false, false, true, false, false, BG, HOVER)).toBe('transparent')
  })

  it('returns transparent for an outlined button hovered while disabled', () => {
    expect(resolveBackgroundColor(false, false, true, true, true, BG, HOVER)).toBe('transparent')
  })

  it('returns the hover background for a solid button hovered while enabled', () => {
    expect(resolveBackgroundColor(false, false, false, true, false, BG, HOVER)).toBe(HOVER)
  })

  it('returns the base background for a solid button hovered while disabled', () => {
    expect(resolveBackgroundColor(false, false, false, true, true, BG, HOVER)).toBe(BG)
  })

  it('returns the base background for a solid button that is not hovered', () => {
    expect(resolveBackgroundColor(false, false, false, false, false, BG, HOVER)).toBe(BG)
  })
})
