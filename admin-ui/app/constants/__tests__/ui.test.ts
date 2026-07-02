import {
  OPACITY,
  SCROLLBAR,
  getHoverOpacity,
  getListHoverOpacity,
  getDividerOpacity,
  getErrorBgOpacity,
  getErrorBorderOpacity,
  getLoadingOverlayOpacity,
  getScrollbarStyles,
} from '@/constants/ui'
import type { ThemeConfig } from '@/context/theme/config'

// Only the theme-color fields getScrollbarStyles reads are needed here.
const themeColors = {
  card: { background: '#111' },
  borderColor: '#222',
} as object as ThemeConfig

describe('opacity selectors', () => {
  it('getHoverOpacity picks the dark/light hover opacity', () => {
    expect(getHoverOpacity(true)).toBe(OPACITY.HOVER_DARK)
    expect(getHoverOpacity(false)).toBe(OPACITY.HOVER_LIGHT)
  })

  it('getListHoverOpacity picks the dark list-hover / shared light value', () => {
    expect(getListHoverOpacity(true)).toBe(OPACITY.LIST_HOVER_DARK)
    expect(getListHoverOpacity(false)).toBe(OPACITY.HOVER_DARK)
  })

  it('getDividerOpacity picks the dark/light divider opacity', () => {
    expect(getDividerOpacity(true)).toBe(OPACITY.DIVIDER_DARK)
    expect(getDividerOpacity(false)).toBe(OPACITY.DIVIDER_LIGHT)
  })

  it('getErrorBgOpacity picks the dark/light error-background opacity', () => {
    expect(getErrorBgOpacity(true)).toBe(OPACITY.ERROR_BG_DARK)
    expect(getErrorBgOpacity(false)).toBe(OPACITY.ERROR_BG_LIGHT)
  })

  it('getErrorBorderOpacity picks strong for dark and the shared divider value for light', () => {
    expect(getErrorBorderOpacity(true)).toBe(OPACITY.STRONG)
    expect(getErrorBorderOpacity(false)).toBe(OPACITY.DIVIDER_DARK)
  })

  it('getLoadingOverlayOpacity picks strong for dark and the placeholder value for light', () => {
    expect(getLoadingOverlayOpacity(true)).toBe(OPACITY.STRONG)
    expect(getLoadingOverlayOpacity(false)).toBe(OPACITY.PLACEHOLDER)
  })

  it('returns numeric opacities in the 0..1 range for every selector', () => {
    const selectors = [
      getHoverOpacity,
      getListHoverOpacity,
      getDividerOpacity,
      getErrorBgOpacity,
      getErrorBorderOpacity,
      getLoadingOverlayOpacity,
    ]
    for (const select of selectors) {
      for (const isDark of [true, false]) {
        const value = select(isDark)
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(1)
      }
    }
  })
})

describe('getScrollbarStyles', () => {
  it('sizes the scrollbar from the SCROLLBAR constants', () => {
    const styles = getScrollbarStyles(themeColors)
    expect(styles['&::-webkit-scrollbar']).toEqual({
      width: SCROLLBAR.WIDTH,
      height: SCROLLBAR.HEIGHT,
    })
    expect(styles['&::-webkit-scrollbar-thumb']).toMatchObject({
      borderRadius: SCROLLBAR.BORDER_RADIUS,
    })
  })

  it('draws the track and thumb from the provided theme colors', () => {
    const styles = getScrollbarStyles(themeColors)
    expect(styles['&::-webkit-scrollbar-track']).toEqual({ backgroundColor: '#111' })
    expect(styles['&::-webkit-scrollbar-thumb']).toMatchObject({ backgroundColor: '#222' })
    expect(styles['&::-webkit-scrollbar-corner']).toEqual({ backgroundColor: '#111' })
  })
})
