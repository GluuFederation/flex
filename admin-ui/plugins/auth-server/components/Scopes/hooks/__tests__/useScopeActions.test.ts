import { renderHook, act } from '@testing-library/react'
import type { LogAuditParams } from 'Utils/AuditLogger'
import { useScopeActions } from '../useScopeActions'
import type { Scope } from '../../types'

const mockLogAuditUserAction = jest.fn()
const mockNavigateToRoute = jest.fn()

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateToRoute: mockNavigateToRoute }),
  ROUTES: {
    AUTH_SERVER_SCOPES_LIST: '/scopes',
    AUTH_SERVER_SCOPE_ADD: '/scope/new',
    AUTH_SERVER_SCOPE_EDIT: (inum: string) => `/scope/edit/${inum}`,
  },
}))

type MockAuthState = {
  config: { clientId: string }
  userinfo: { inum: string; name: string }
}

type MockRootState = { authReducer: MockAuthState }

const mockAuthState: MockAuthState = {
  config: { clientId: 'client-123' },
  userinfo: { inum: 'user-1', name: 'admin' },
}

jest.mock('@/redux/hooks', () => ({
  useAppSelector: <T,>(selector: (s: MockRootState) => T): T =>
    selector({ authReducer: mockAuthState }),
}))

const scope: Scope = { id: 'scope-id', inum: 'scope-inum', displayName: 'My Scope' } as Scope

describe('useScopeActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('exposes all action functions', () => {
    const { result } = renderHook(() => useScopeActions())
    expect(typeof result.current.logScopeCreation).toBe('function')
    expect(typeof result.current.logScopeUpdate).toBe('function')
    expect(typeof result.current.logScopeDeletion).toBe('function')
    expect(typeof result.current.navigateToScopeList).toBe('function')
    expect(typeof result.current.navigateToScopeAdd).toBe('function')
    expect(typeof result.current.navigateToScopeEdit).toBe('function')
  })

  it('logScopeCreation calls audit logger with CREATE action', async () => {
    const { result } = renderHook(() => useScopeActions())
    await act(async () => {
      await result.current.logScopeCreation(scope, 'created')
    })
    expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE',
        message: 'created',
        performedOn: 'scope-id',
        client_id: 'client-123',
        userinfo: mockAuthState.userinfo,
      }),
    )
  })

  it('logScopeUpdate calls audit logger with UPDATE action and modifiedFields', async () => {
    const { result } = renderHook(() => useScopeActions())
    await act(async () => {
      await result.current.logScopeUpdate(scope, 'updated', { displayName: 'New' })
    })
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        message: 'updated',
        modifiedFields: { displayName: 'New' },
      }),
    )
  })

  it('logScopeDeletion calls audit logger with DELETION action and minimal payload', async () => {
    const { result } = renderHook(() => useScopeActions())
    await act(async () => {
      await result.current.logScopeDeletion(scope, 'deleted')
    })
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'DELETION',
        message: 'deleted',
        payload: { inum: 'scope-inum', id: 'scope-id' },
      }),
    )
  })

  it('navigation helpers call navigateToRoute with the correct routes', () => {
    const { result } = renderHook(() => useScopeActions())
    act(() => {
      result.current.navigateToScopeList()
    })
    expect(mockNavigateToRoute).toHaveBeenCalledWith('/scopes')

    act(() => {
      result.current.navigateToScopeAdd()
    })
    expect(mockNavigateToRoute).toHaveBeenCalledWith('/scope/new')

    act(() => {
      result.current.navigateToScopeEdit('abc')
    })
    expect(mockNavigateToRoute).toHaveBeenCalledWith('/scope/edit/abc')
  })
})
