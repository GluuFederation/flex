import { renderHook, act } from '@testing-library/react'
import { useConfigApiActions } from 'Plugins/auth-server/components/ConfigApiProperties/utils/useConfigApiActions'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { CONFIG_API_CONFIGURATION } from '@/audit/Resources'

type MockAuthState = {
  authReducer: {
    config: { clientId: string }
    userinfo: { name: string; inum: string }
  }
}

const mockState: MockAuthState = {
  authReducer: {
    config: { clientId: 'client-123' },
    userinfo: { name: 'Admin', inum: 'user-1' },
  },
}

jest.mock('@/redux/hooks', () => ({
  useAppSelector: <Result>(selector: (state: MockAuthState) => Result): Result =>
    selector(mockState),
}))

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: jest.fn().mockResolvedValue(undefined),
}))

const mockedLog = logAuditUserAction as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

describe('useConfigApiActions', () => {
  it('exposes logConfigApiUpdate', () => {
    const { result } = renderHook(() => useConfigApiActions())
    expect(typeof result.current.logConfigApiUpdate).toBe('function')
  })

  it('calls logAuditUserAction with the expected payload', async () => {
    const { result } = renderHook(() => useConfigApiActions())
    await act(async () => {
      await result.current.logConfigApiUpdate('changed config', { field: 'value' })
    })

    expect(mockedLog).toHaveBeenCalledTimes(1)
    expect(mockedLog).toHaveBeenCalledWith({
      userinfo: mockState.authReducer.userinfo,
      action: UPDATE,
      resource: CONFIG_API_CONFIGURATION,
      message: 'changed config',
      modifiedFields: { field: 'value' },
      performedOn: 'config-api',
      client_id: 'client-123',
    })
  })

  it('passes undefined modifiedFields when omitted', async () => {
    const { result } = renderHook(() => useConfigApiActions())
    await act(async () => {
      await result.current.logConfigApiUpdate('no fields')
    })
    expect(mockedLog).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'no fields', modifiedFields: undefined }),
    )
  })
})
