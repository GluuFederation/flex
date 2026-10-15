import shortCodes from 'Plugins/admin/helper/shortCodes.json'
import { adminUiFeatures } from '@/constants'

describe('webhook shortcodes', () => {
  it('has one shortcode list for every webhook feature admin-ui triggers, and no others', () => {
    expect(Object.keys(shortCodes).sort()).toEqual(Object.values(adminUiFeatures).sort())
  })
})
