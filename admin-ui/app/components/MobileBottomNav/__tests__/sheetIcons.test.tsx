import { isValidElement } from 'react'
import { SHEET_ICON_BY_KEY } from '../sheetIcons'
import { MORE_TILE_DEFS } from '../sheetConstants'

describe('SHEET_ICON_BY_KEY', () => {
  it('maps every icon key to a valid React element', () => {
    for (const key of Object.keys(SHEET_ICON_BY_KEY)) {
      expect(isValidElement(SHEET_ICON_BY_KEY[key])).toBe(true)
    }
  })

  it('provides an icon for every More-tile iconKey', () => {
    for (const tile of MORE_TILE_DEFS) {
      if (!tile.iconKey) continue
      expect(SHEET_ICON_BY_KEY[tile.iconKey]).toBeDefined()
    }
  })

  it('tags each icon with the shared sheet-icon className', () => {
    for (const key of Object.keys(SHEET_ICON_BY_KEY)) {
      const element = SHEET_ICON_BY_KEY[key] as { props: { className?: string } }
      expect(element.props.className).toBe('mobile-sheet-icon')
    }
  })
})
