import { renderHook, waitFor } from '@testing-library/react'
import type { LogAuditParams } from 'Utils/AuditLogger'
import { useAuthServerScripts } from 'Plugins/auth-server/components/AuthServerProperties/hooks/useAuthServerScripts'

const mockLogAuditUserAction = jest.fn()
const mockLoggerError = jest.fn()
const mockUseGetConfigScripts = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetConfigScripts: () => mockUseGetConfigScripts(),
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

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail: Error | string) => mockLoggerError(message, detail),
  },
}))

const validScript = { name: 'pwd', scriptType: 'PERSON_AUTHENTICATION', enabled: true }
const invalidScript = { name: 'broken' }

describe('useAuthServerScripts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
    mockUseGetConfigScripts.mockReturnValue({ data: undefined, isSuccess: false })
  })

  it('returns an empty array when there is no data', () => {
    const { result } = renderHook(() => useAuthServerScripts())
    expect(result.current).toEqual([])
  })

  it('filters out entries that are not valid script entries', () => {
    mockUseGetConfigScripts.mockReturnValue({
      data: { entries: [validScript, invalidScript] },
      isSuccess: true,
    })
    const { result } = renderHook(() => useAuthServerScripts())
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ name: 'pwd' })
  })

  it('does not audit while the query has not succeeded', () => {
    renderHook(() => useAuthServerScripts())
    expect(mockLogAuditUserAction).not.toHaveBeenCalled()
  })

  it('logs an audit action once on success', async () => {
    mockUseGetConfigScripts.mockReturnValue({
      data: { entries: [validScript] },
      isSuccess: true,
    })
    const { rerender } = renderHook(() => useAuthServerScripts())

    await waitFor(() => {
      expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'FETCH SCRIPTS FOR STAT',
        resource: 'SCRIPT',
        client_id: 'test-client-id',
        userinfo: { inum: 'inum-123', name: 'admin' },
      }),
    )

    rerender()
    expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
  })

  it('logs an error when the audit call rejects', async () => {
    const failure = new Error('audit failed')
    mockLogAuditUserAction.mockRejectedValueOnce(failure)
    mockUseGetConfigScripts.mockReturnValue({
      data: { entries: [validScript] },
      isSuccess: true,
    })

    renderHook(() => useAuthServerScripts())

    await waitFor(() => {
      expect(mockLoggerError).toHaveBeenCalledWith('[AuthServer scripts audit] failed', failure)
    })
  })
})
