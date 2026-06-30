import { renderHook, act } from '@testing-library/react'
import type { LogAuditParams } from 'Utils/AuditLogger'
import { useSchemaAuditLogger } from 'Plugins/user-claims/hooks/useSchemaAuditLogger'

const mockLogAuditUserAction = jest.fn()
const mockLoggerError = jest.fn()

type AuthState = {
  userinfo?: { inum: string; name: string }
  config?: { clientId?: string }
  location?: { IPv4?: string }
}

let mockAuthState: AuthState = {
  userinfo: { inum: 'inum-123', name: 'admin' },
  config: { clientId: 'client-1' },
  location: { IPv4: '127.0.0.1' },
}

jest.mock('@/redux/hooks', () => ({
  useAppSelector: jest.fn((selector: (s: { authReducer: AuthState }) => AuthState) =>
    selector({ authReducer: mockAuthState }),
  ),
}))

jest.mock('@/utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail: Error | string) => mockLoggerError(message, detail),
  },
}))

describe('useSchemaAuditLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
    mockAuthState = {
      userinfo: { inum: 'inum-123', name: 'admin' },
      config: { clientId: 'client-1' },
      location: { IPv4: '127.0.0.1' },
    }
  })

  it('returns a logAudit function', () => {
    const { result } = renderHook(() => useSchemaAuditLogger())
    expect(typeof result.current.logAudit).toBe('function')
  })

  it('forwards a non-update action with its payload and audit context', async () => {
    const { result } = renderHook(() => useSchemaAuditLogger())
    const payload = { inum: 'attr-1' }

    await act(async () => {
      await result.current.logAudit({
        action: 'CREATE',
        resource: 'api-attribute',
        message: 'created',
        payload,
      })
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE',
        resource: 'api-attribute',
        message: 'created',
        client_id: 'client-1',
        userinfo: { inum: 'inum-123', name: 'admin' },
        extra: { ip_address: '127.0.0.1' },
        payload,
      }),
    )
  })

  it('omits the payload for UPDATE actions and forwards modifiedFields', async () => {
    const { result } = renderHook(() => useSchemaAuditLogger())

    await act(async () => {
      await result.current.logAudit({
        action: 'UPDATE',
        resource: 'api-attribute',
        message: 'updated',
        payload: { inum: 'attr-1' },
        modifiedFields: { displayName: 'new' },
      })
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        payload: undefined,
        modifiedFields: { displayName: 'new' },
      }),
    )
  })

  it('passes an empty extra object when no IP address is available', async () => {
    mockAuthState = { userinfo: { inum: 'inum-123', name: 'admin' } }
    const { result } = renderHook(() => useSchemaAuditLogger())

    await act(async () => {
      await result.current.logAudit({
        action: 'CREATE',
        resource: 'api-attribute',
        message: 'created',
        payload: {},
      })
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(expect.objectContaining({ extra: {} }))
  })

  it('logs an error and does not throw when logAuditUserAction rejects', async () => {
    const failure = new Error('audit failed')
    mockLogAuditUserAction.mockRejectedValueOnce(failure)
    const { result } = renderHook(() => useSchemaAuditLogger())

    await act(async () => {
      await expect(
        result.current.logAudit({ action: 'CREATE', resource: 'r', message: 'm', payload: {} }),
      ).resolves.toBeUndefined()
    })

    expect(mockLoggerError).toHaveBeenCalledTimes(1)
    expect(mockLoggerError).toHaveBeenCalledWith(
      '[useSchemaAuditLogger] Failed to log audit action:',
      failure,
    )
  })
})
