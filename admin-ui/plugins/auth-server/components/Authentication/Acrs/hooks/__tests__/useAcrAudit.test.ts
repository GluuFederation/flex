import { renderHook, act } from '@testing-library/react'
import type { AuthenticationMethod } from 'JansConfigApi'
import type { LogAuditParams } from 'Utils/AuditLogger'
import { useAcrAudit } from 'Plugins/auth-server/components/Authentication/Acrs/hooks/useAcrAudit'

const mockLogAuditUserAction = jest.fn()

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

type AuthState = {
  authReducer: {
    config: { clientId: string }
    userinfo: { inum: string; name: string }
  }
}

jest.mock('@/redux/hooks', () => ({
  useAppSelector: jest.fn(<TSelected>(selector: (s: AuthState) => TSelected) =>
    selector({
      authReducer: {
        config: { clientId: 'test-client-id' },
        userinfo: { inum: 'inum-123', name: 'admin' },
      },
    }),
  ),
}))

const mockAcr: AuthenticationMethod = {
  defaultAcr: 'simple_password_auth',
}

describe('useAcrAudit', () => {
  beforeEach(() => {
    mockLogAuditUserAction.mockReset()
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('returns a logAcrUpdate function', () => {
    const { result } = renderHook(() => useAcrAudit())
    expect(typeof result.current.logAcrUpdate).toBe('function')
  })

  it('calls logAuditUserAction with the expected audit shape', async () => {
    const { result } = renderHook(() => useAcrAudit())

    await act(async () => {
      await result.current.logAcrUpdate(mockAcr, 'Updated default ACR', {
        defaultAcr: 'simple_password_auth',
      })
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        resource: 'api-acrs',
        message: 'Updated default ACR',
        modifiedFields: { defaultAcr: 'simple_password_auth' },
        performedOn: 'simple_password_auth',
        client_id: 'test-client-id',
        payload: mockAcr,
        userinfo: { inum: 'inum-123', name: 'admin' },
      }),
    )
  })

  it('passes performedOn from acr.defaultAcr', async () => {
    const { result } = renderHook(() => useAcrAudit())
    const otherAcr: AuthenticationMethod = { defaultAcr: 'otp' }

    await act(async () => {
      await result.current.logAcrUpdate(otherAcr, 'msg')
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({ performedOn: 'otp', modifiedFields: undefined }),
    )
  })
})
