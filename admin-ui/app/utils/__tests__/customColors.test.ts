import customColors, {
  hexToRgb,
  getLoadingOverlayRgba,
  getCustomColorsAsCssVars,
} from '@/customColors'

describe('customColors', () => {
  describe('hexToRgb', () => {
    it('converts a 6-digit hex to an "r, g, b" string', () => {
      expect(hexToRgb('#ffffff')).toBe('255, 255, 255')
      expect(hexToRgb('#000000')).toBe('0, 0, 0')
      expect(hexToRgb('#0a2540')).toBe('10, 37, 64')
    })

    it('returns the default fallback for an invalid hex', () => {
      expect(hexToRgb('not-a-color')).toBe('0, 0, 0')
    })

    it('returns a custom fallback when provided', () => {
      expect(hexToRgb('bad', '1, 2, 3')).toBe('1, 2, 3')
    })
  })

  describe('getLoadingOverlayRgba', () => {
    it('wraps the converted color in an rgba() with the given opacity', () => {
      expect(getLoadingOverlayRgba('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)')
    })

    it('uses the hexToRgb fallback for an invalid color', () => {
      expect(getLoadingOverlayRgba('nope', 0.25)).toBe('rgba(0, 0, 0, 0.25)')
    })
  })

  describe('getCustomColorsAsCssVars', () => {
    it('exposes a kebab-cased CSS variable for each color plus an -rgb companion', () => {
      const vars = getCustomColorsAsCssVars()
      expect(vars['--custom-white']).toBe(customColors.white)
      expect(vars['--custom-white-rgb']).toBe('255, 255, 255')
      expect(vars['--custom-primary-dark']).toBe(customColors.primaryDark)
    })

    it('returns a frozen object', () => {
      expect(Object.isFrozen(getCustomColorsAsCssVars())).toBe(true)
    })

    it('produces two CSS vars (value + rgb) for every color key', () => {
      const vars = getCustomColorsAsCssVars()
      expect(Object.keys(vars)).toHaveLength(Object.keys(customColors).length * 2)
    })
  })
})
