import { renderHook, act } from '@testing-library/react'
import type { Deployment } from 'JansConfigApi'
import type { LogAuditParams } from 'Utils/AuditLogger'
import { useAgamaActions } from 'Plugins/auth-server/components/Authentication/AgamaFlows/hooks/useAgamaActions'

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

const mockProject: Deployment = {
  dn: 'agama-dn-1',
  id: 'agama-id-1',
}

describe('useAgamaActions', () => {
  beforeEach(() => {
    mockLogAuditUserAction.mockReset()
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('exposes the four audit functions', () => {
    const { result } = renderHook(() => useAgamaActions())
    expect(typeof result.current.logAgamaCreation).toBe('function')
    expect(typeof result.current.logAgamaUpdate).toBe('function')
    expect(typeof result.current.logAgamaDeletion).toBe('function')
    expect(typeof result.current.logAcrMappingUpdate).toBe('function')
  })

  it('logAgamaCreation sends CREATE audit with project identity payload', async () => {
    const { result } = renderHook(() => useAgamaActions())

    await act(async () => {
      await result.current.logAgamaCreation(mockProject, 'created project', { name: 'p' })
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE',
        resource: 'agama-project',
        message: 'created project',
        modifiedFields: { name: 'p' },
        performedOn: 'agama-dn-1',
        client_id: 'test-client-id',
        payload: { dn: 'agama-dn-1', id: 'agama-id-1' },
        userinfo: { inum: 'inum-123', name: 'admin' },
      }),
    )
  })

  it('logAgamaUpdate sends UPDATE audit', async () => {
    const { result } = renderHook(() => useAgamaActions())

    await act(async () => {
      await result.current.logAgamaUpdate(mockProject, 'updated project')
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        resource: 'agama-project',
        performedOn: 'agama-dn-1',
      }),
    )
  })

  it('logAgamaDeletion sends DELETION audit', async () => {
    const { result } = renderHook(() => useAgamaActions())

    await act(async () => {
      await result.current.logAgamaDeletion(mockProject, 'deleted project')
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'DELETION',
        resource: 'agama-project',
        performedOn: 'agama-dn-1',
      }),
    )
  })

  it('falls back to project.id for performedOn when dn is missing', async () => {
    const { result } = renderHook(() => useAgamaActions())
    const noDn: Deployment = { id: 'only-id' }

    await act(async () => {
      await result.current.logAgamaCreation(noDn, 'msg')
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({ performedOn: 'only-id' }),
    )
  })

  it('logAcrMappingUpdate sends UPDATE audit against json-configuration', async () => {
    const { result } = renderHook(() => useAgamaActions())

    await act(async () => {
      await result.current.logAcrMappingUpdate('mapping changed', { acr: 'x' })
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        resource: 'json-configuration',
        message: 'mapping changed',
        modifiedFields: { acr: 'x' },
        performedOn: '/acrMappings',
        client_id: 'test-client-id',
      }),
    )
  })
})
