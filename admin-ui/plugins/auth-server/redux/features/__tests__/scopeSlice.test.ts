import { reducer, setClientSelectedScopes } from '../scopeSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('scopeSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ selectedClientScopes: [] })
  })

  it('setClientSelectedScopes replaces the selected scopes', () => {
    const scopes = [{ inum: 's1' }, { inum: 's2' }] as never
    expect(reducer(getInitial(), setClientSelectedScopes(scopes)).selectedClientScopes).toBe(scopes)
  })
})
