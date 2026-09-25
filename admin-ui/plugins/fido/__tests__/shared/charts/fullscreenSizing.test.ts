import { getFullscreenCanvasStyle } from 'Plugins/fido/shared/charts'

describe('getFullscreenCanvasStyle', () => {
  it('fills the scroll frame exactly at 100%, so nothing overflows', () => {
    const style = getFullscreenCanvasStyle(true, 1)

    expect(style?.height).toBe('100%')
    expect(style?.width).toBe('100%')
  })

  it('grows past the frame only once the viewer zooms in', () => {
    expect(getFullscreenCanvasStyle(true, 1.25)?.height).toBe('125%')
    expect(getFullscreenCanvasStyle(true, 3)?.height).toBe('300%')
  })

  it('leaves the card view untouched', () => {
    expect(getFullscreenCanvasStyle(false, 2)).toBeUndefined()
  })
})
