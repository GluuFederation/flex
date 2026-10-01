import {
  ACR_TYPES,
  ALIASES_TAB_INDEX,
  BUILT_IN_ACRS,
  TAB_IDS,
  TAB_ORDER,
  getTabIndex,
} from '../constants'

describe('Authentication tab constants', () => {
  it('keeps the tab order shown on the page', () => {
    expect(TAB_ORDER).toEqual([
      TAB_IDS.DEFAULT_ACR,
      TAB_IDS.BUILT_IN,
      TAB_IDS.ACRS,
      TAB_IDS.ALIASES,
      TAB_IDS.AGAMA_PROJECTS,
    ])
  })

  it.each(TAB_ORDER.map((id, index) => [id, index] as const))(
    'resolves tab id %s to index %i',
    (id, index) => {
      expect(getTabIndex(id)).toBe(index)
    },
  )

  it.each([undefined, '', 'agama_flows', 'unknown'])('falls back to the first tab for %p', (id) => {
    expect(getTabIndex(id)).toBe(0)
  })

  it('points the aliases index at the Aliases tab', () => {
    expect(TAB_ORDER[ALIASES_TAB_INDEX]).toBe(TAB_IDS.ALIASES)
  })

  it('tags the built-in ACR with the builtin type', () => {
    expect(BUILT_IN_ACRS.map((acr) => acr.acrType)).toEqual([ACR_TYPES.BUILTIN])
  })
})
