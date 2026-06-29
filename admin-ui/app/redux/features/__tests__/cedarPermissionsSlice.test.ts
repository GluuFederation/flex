import reducer, {
  setCedarlingPermission,
  setCedarlingInitialized,
  setCedarlingInitializing,
  setCedarFailedStatusAfterMaxTries,
  setPolicyStoreBytes,
} from '../cedarPermissionsSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('cedarPermissionsSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({
      permissions: {},
      initialized: null,
      isInitializing: false,
      cedarFailedStatusAfterMaxTries: null,
      policyStoreBytes: '',
    })
  })

  it('setCedarlingPermission stores authorization per resource id', () => {
    const state = reducer(
      getInitial(),
      setCedarlingPermission({ resourceId: 'res-1', isAuthorized: true } as never),
    )
    expect(state.permissions['res-1']).toBe(true)
  })

  it('setCedarlingInitialized sets flag and clears isInitializing', () => {
    const initializing = reducer(getInitial(), setCedarlingInitializing(true))
    expect(initializing.isInitializing).toBe(true)
    const done = reducer(initializing, setCedarlingInitialized(true))
    expect(done.initialized).toBe(true)
    expect(done.isInitializing).toBe(false)
  })

  it('setCedarFailedStatusAfterMaxTries flips to true', () => {
    expect(
      reducer(getInitial(), setCedarFailedStatusAfterMaxTries()).cedarFailedStatusAfterMaxTries,
    ).toBe(true)
  })

  it('setPolicyStoreBytes stores the payload', () => {
    expect(reducer(getInitial(), setPolicyStoreBytes('abc')).policyStoreBytes).toBe('abc')
  })
})
