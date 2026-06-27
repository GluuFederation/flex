import { reducer, setClientSelectedScopes } from '../scopeSlice'
import type { ScopeItem } from 'Redux/types'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('scopeSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ selectedClientScopes: [] })
  })

  it('setClientSelectedScopes replaces the selected scopes', () => {
    const scopes: ScopeItem[] = [{ inum: 's1' }, { inum: 's2' }]
    expect(reducer(getInitial(), setClientSelectedScopes(scopes)).selectedClientScopes).toEqual(
      scopes,
    )
  })
})
