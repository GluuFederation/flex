import type { JsonPatch } from 'JansConfigApi'
import type { UserAction } from 'Utils/types'

type AuditPayload = { audit: boolean }
type ActionType = 'FETCH' | 'PATCH' | 'DELETION'
type AuditExtras = { action: UserAction }

// Collaborators are covered by their own suites; stub them so the assertions
// target this service's audit action-type selection and error/403 handling.
const mockFetch = jest.fn()
const mockPatch = jest.fn()
jest.mock('../../api/jsonPropertiesClient', () => ({
  callFetchJsonProperties: () => mockFetch(),
  callPatchJsonProperties: (patches: JsonPatch[]) => mockPatch(patches),
}))

const mockPostUserAction = jest.fn()
jest.mock('Redux/api/backend-api', () => ({
  postUserAction: (a: AuditPayload) => mockPostUserAction(a),
}))

const mockAddAdditionalData = jest.fn()
const mockIsForbidden = jest.fn((_e?: Error) => false)
jest.mock('Utils/TokenController', () => ({
  addAdditionalData: (
    audit: AuditPayload,
    type: ActionType,
    resource: string,
    extras: AuditExtras,
  ) => mockAddAdditionalData(audit, type, resource, extras),
  isFourZeroThreeError: (e: Error) => mockIsForbidden(e),
}))

const mockRedirect = jest.fn()
jest.mock('../../utils/sessionExpiredRedirect', () => ({
  redirectSessionExpired: () => mockRedirect(),
}))

jest.mock('@/audit', () => ({
  FETCH: 'FETCH',
  PATCH: 'PATCH',
  DELETION: 'DELETION',
  createSuccessAuditInit: () => ({ audit: true }),
  getCurrentAuditContext: () => ({}),
}))
jest.mock('../../redux/utils/auditHelpers', () => ({
  enhanceJsonConfigAuditPayload: (payload: AuditExtras) => payload,
}))
jest.mock('../../redux/audit/Resources', () => ({ JSON_CONFIG: 'jsonConfig' }))
jest.mock('@/utils/logger', () => ({ logger: { error: jest.fn() } }))
jest.mock('@/utils/apiErrorMessage', () => ({ resolveApiErrorMessage: (e: Error) => e.message }))

import {
  fetchAuthServerJsonProperties,
  patchAuthServerJsonProperties,
} from '../jsonPropertiesService'

const actionType = () => mockAddAdditionalData.mock.calls[0][1]

beforeEach(() => {
  mockFetch.mockReset()
  mockPatch.mockReset()
  mockPostUserAction.mockReset().mockResolvedValue(undefined)
  mockAddAdditionalData.mockReset()
  mockIsForbidden.mockReset().mockReturnValue(false)
  mockRedirect.mockReset()
})

describe('fetchAuthServerJsonProperties', () => {
  it('returns the fetched config and posts a FETCH audit action', async () => {
    mockFetch.mockResolvedValue({ some: 'config' })
    const data = await fetchAuthServerJsonProperties()
    expect(data).toEqual({ some: 'config' })
    expect(actionType()).toBe('FETCH')
    expect(mockPostUserAction).toHaveBeenCalledWith({ audit: true })
  })

  it('rethrows and does not redirect on a non-403 failure', async () => {
    mockFetch.mockRejectedValue(new Error('500'))
    await expect(fetchAuthServerJsonProperties()).rejects.toThrow('500')
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('redirects to the session-expired flow on a 403 failure', async () => {
    mockFetch.mockRejectedValue(new Error('403'))
    mockIsForbidden.mockReturnValue(true)
    await expect(fetchAuthServerJsonProperties()).rejects.toThrow('403')
    expect(mockRedirect).toHaveBeenCalledTimes(1)
  })
})

describe('patchAuthServerJsonProperties', () => {
  type PatchActionData = { deletedMapping?: boolean; requestBody?: JsonPatch[] }
  const action = (action_data?: PatchActionData): UserAction =>
    ({ action_data }) as Partial<UserAction> as UserAction

  it('records a PATCH action for an ordinary replace patch', async () => {
    mockPatch.mockResolvedValue({ ok: true })
    await patchAuthServerJsonProperties(
      action({ requestBody: [{ op: 'replace', path: '/x', value: 1 }] }),
    )
    expect(actionType()).toBe('PATCH')
    expect(mockPatch).toHaveBeenCalledWith([{ op: 'replace', path: '/x', value: 1 }])
  })

  it('records a DELETION action when a remove patch is present', async () => {
    mockPatch.mockResolvedValue({})
    await patchAuthServerJsonProperties(action({ requestBody: [{ op: 'remove', path: '/y' }] }))
    expect(actionType()).toBe('DELETION')
  })

  it('records a DELETION action when deletedMapping is set', async () => {
    mockPatch.mockResolvedValue({})
    await patchAuthServerJsonProperties(action({ deletedMapping: true, requestBody: [] }))
    expect(actionType()).toBe('DELETION')
  })

  it('defaults to an empty patch list when no request body is provided', async () => {
    mockPatch.mockResolvedValue({})
    await patchAuthServerJsonProperties(action(undefined))
    expect(mockPatch).toHaveBeenCalledWith([])
    expect(actionType()).toBe('PATCH')
  })

  it('redirects on a 403 patch failure and rethrows', async () => {
    mockPatch.mockRejectedValue(new Error('403'))
    mockIsForbidden.mockReturnValue(true)
    await expect(
      patchAuthServerJsonProperties(action({ requestBody: [{ op: 'replace' }] })),
    ).rejects.toThrow('403')
    expect(mockRedirect).toHaveBeenCalledTimes(1)
  })
})
