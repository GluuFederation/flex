jest.mock('Orval', () => ({ setApiToken: jest.fn(), getApiToken: jest.fn(() => null) }))
jest.mock('../backend-api', () => ({ fetchApiTokenWithDefaultScopes: jest.fn() }))
jest.mock('../sessionState', () => ({ hasActiveSession: jest.fn(() => false) }))
jest.mock('@/utils/logger', () => ({ logger: { error: jest.fn(), info: jest.fn() } }))

import { getApiToken, setApiToken } from 'Orval'
import { fetchApiTokenWithDefaultScopes } from '../backend-api'
import { hasActiveSession } from '../sessionState'
import { clearApiToken, ensureApiToken } from '../apiToken'
import type { AppDispatch } from '../../hooks'

const mockedFetch = fetchApiTokenWithDefaultScopes as jest.MockedFunction<
  typeof fetchApiTokenWithDefaultScopes
>
const mockedGetApiToken = getApiToken as jest.MockedFunction<typeof getApiToken>
const mockedSetApiToken = setApiToken as jest.MockedFunction<typeof setApiToken>
const mockedHasActiveSession = hasActiveSession as jest.MockedFunction<typeof hasActiveSession>

const buildJwt = (exp: number) =>
  `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`

const dispatch: AppDispatch = jest.fn()

describe('ensureApiToken owns the api protection token', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearApiToken()
    mockedGetApiToken.mockReturnValue(null)
    mockedHasActiveSession.mockReturnValue(false)
    mockedFetch.mockResolvedValue({ access_token: 'tok' })
  })

  it('mints once and serves the cached token afterwards', async () => {
    const first = await ensureApiToken(dispatch)
    mockedGetApiToken.mockReturnValue('tok')
    const second = await ensureApiToken(dispatch)

    expect(first?.access_token).toBe('tok')
    expect(second?.access_token).toBe('tok')
    expect(mockedFetch).toHaveBeenCalledTimes(1)
    expect(mockedSetApiToken).toHaveBeenCalledWith('tok')
  })

  it('collapses concurrent callers onto a single request', async () => {
    const [a, b, c] = await Promise.all([
      ensureApiToken(dispatch),
      ensureApiToken(dispatch),
      ensureApiToken(dispatch),
    ])

    expect(mockedFetch).toHaveBeenCalledTimes(1)
    expect([a?.access_token, b?.access_token, c?.access_token]).toEqual(['tok', 'tok', 'tok'])
  })

  it('skips the request entirely once a session cookie is live', async () => {
    mockedHasActiveSession.mockReturnValue(true)

    await expect(ensureApiToken(dispatch)).resolves.toBeNull()
    expect(mockedFetch).not.toHaveBeenCalled()
  })

  it('still mints for callers that require a token despite a live session', async () => {
    mockedHasActiveSession.mockReturnValue(true)

    const token = await ensureApiToken(dispatch, { required: true })

    expect(token?.access_token).toBe('tok')
    expect(mockedFetch).toHaveBeenCalledTimes(1)
  })

  it('remints when the cached token is close to expiry', async () => {
    mockedFetch.mockResolvedValue({ access_token: buildJwt(Math.floor(Date.now() / 1000) + 10) })

    const first = await ensureApiToken(dispatch)
    mockedGetApiToken.mockReturnValue(first?.access_token ?? null)
    await ensureApiToken(dispatch)

    expect(mockedFetch).toHaveBeenCalledTimes(2)
  })

  it('keeps a cached token that is comfortably inside its expiry', async () => {
    mockedFetch.mockResolvedValue({ access_token: buildJwt(Math.floor(Date.now() / 1000) + 3600) })

    const first = await ensureApiToken(dispatch)
    mockedGetApiToken.mockReturnValue(first?.access_token ?? null)
    await ensureApiToken(dispatch)

    expect(mockedFetch).toHaveBeenCalledTimes(1)
  })

  it('force remints even when a usable token is cached', async () => {
    await ensureApiToken(dispatch)
    mockedGetApiToken.mockReturnValue('tok')
    await ensureApiToken(dispatch, { force: true })

    expect(mockedFetch).toHaveBeenCalledTimes(2)
  })

  it('drops the cache when the interceptor slot was cleared elsewhere', async () => {
    await ensureApiToken(dispatch)
    mockedGetApiToken.mockReturnValue(null)
    await ensureApiToken(dispatch)

    expect(mockedFetch).toHaveBeenCalledTimes(2)
  })

  it('clears the token and rethrows when the mint fails', async () => {
    mockedFetch.mockRejectedValue(new Error('token boom'))

    await expect(ensureApiToken(dispatch)).rejects.toThrow('token boom')
    expect(mockedSetApiToken).toHaveBeenCalledWith(null)

    mockedFetch.mockResolvedValue({ access_token: 'tok' })
    await expect(ensureApiToken(dispatch)).resolves.toEqual({ access_token: 'tok' })
  })
})
