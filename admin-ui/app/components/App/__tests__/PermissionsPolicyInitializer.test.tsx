import React from 'react'
import { render, waitFor } from '@testing-library/react'
import PermissionsPolicyInitializer from '../PermissionsPolicyInitializer'
import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'

type CedarInitState = {
  authReducer: { hasSession: boolean; config: { cedarlingLogType: string } }
  cedarPermissions: { initialized: boolean; isInitializing: boolean; policyStoreBytes: string }
}

// jest hoists mock factories above imports, so any variable a factory closes
// over must be prefixed with `mock` to satisfy the babel-jest guard.
const mockDispatch = jest.fn()
const mockState: CedarInitState = {
  authReducer: { hasSession: true, config: { cedarlingLogType: 'std_out' } },
  cedarPermissions: { initialized: false, isInitializing: false, policyStoreBytes: 'dmFsaWQ=' },
}
jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(fn: (s: CedarInitState) => T) => fn(mockState),
}))

const mockInitialize = jest.fn()
jest.mock('@/cedarling/client', () => ({
  cedarlingClient: {
    initialize: (config: object, bytes: Uint8Array) => mockInitialize(config, bytes),
  },
}))
jest.mock('@/utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

// Action creators return identifiable plain objects so dispatch calls can be asserted.
jest.mock('../../../redux/features/cedarPermissionsSlice', () => ({
  setCedarlingInitializing: (v: boolean) => ({ type: 'initializing', payload: v }),
  setCedarlingInitialized: (v: boolean) => ({ type: 'initialized', payload: v }),
  setCedarFailedStatusAfterMaxTries: () => ({ type: 'failed' }),
}))

const resetState = () => {
  mockState.authReducer = {
    hasSession: true,
    config: { cedarlingLogType: CEDARLING_LOG_TYPE.STD_OUT },
  }
  mockState.cedarPermissions = {
    initialized: false,
    isInitializing: false,
    policyStoreBytes: 'dmFsaWQ=',
  }
}

describe('PermissionsPolicyInitializer', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockInitialize.mockReset()
    resetState()
  })

  it('renders nothing', () => {
    mockInitialize.mockReturnValue(new Promise(() => {}))
    const { container } = render(<PermissionsPolicyInitializer />)
    expect(container).toBeEmptyDOMElement()
  })

  it('initializes cedarling when all gating conditions are met', async () => {
    mockInitialize.mockResolvedValue(undefined)
    render(<PermissionsPolicyInitializer />)
    await waitFor(() => expect(mockInitialize).toHaveBeenCalledTimes(1))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'initializing', payload: true })
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'initialized', payload: true }),
    )
  })

  it('does not initialize when there is no session', () => {
    mockState.authReducer.hasSession = false as never
    render(<PermissionsPolicyInitializer />)
    expect(mockInitialize).not.toHaveBeenCalled()
  })

  it('does not initialize when already initialized', () => {
    mockState.cedarPermissions.initialized = true as never
    render(<PermissionsPolicyInitializer />)
    expect(mockInitialize).not.toHaveBeenCalled()
  })

  it('does not initialize when policy store bytes are blank', () => {
    mockState.cedarPermissions.policyStoreBytes = '   ' as never
    render(<PermissionsPolicyInitializer />)
    expect(mockInitialize).not.toHaveBeenCalled()
  })

  it('aborts and clears the initializing flag when the policy store bytes fail to decode', () => {
    mockState.cedarPermissions.policyStoreBytes = '@@not-base64@@' as never
    render(<PermissionsPolicyInitializer />)
    expect(mockInitialize).not.toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'initializing', payload: false })
  })

  it('schedules a retry (reset to uninitialized) on the first initialization failure', async () => {
    jest.useFakeTimers()
    mockInitialize.mockRejectedValue(new Error('boom'))
    render(<PermissionsPolicyInitializer />)
    await waitFor(() => expect(mockInitialize).toHaveBeenCalled())
    jest.advanceTimersByTime(1000)
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'initialized', payload: false }),
    )
    jest.useRealTimers()
  })
})
