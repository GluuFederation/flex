import type { AxiosRequestConfig } from 'axios'
import type { CancellablePromise } from '../types'

// axiosInstance resolves its baseURL at module load and builds the shared
// AXIOS_INSTANCE via Axios.create, so each scenario sets the relevant globals,
// resets the module registry, then re-imports to observe the created config.
type ResponsePayload = { ok: boolean }
type AxiosConfig = { baseURL: string; timeout: number }
type CreatedInstance = ((config: AxiosRequestConfig) => Promise<{ data: ResponsePayload }>) & {
  __config: AxiosConfig
  defaults: { headers: { common: Record<string, string> } }
}

const instanceCalls: AxiosRequestConfig[] = []
const cancelCalls: string[] = []

// A fresh mock instance is produced per Axios.create call; it records the request
// config it was invoked with and resolves to a fixed payload.
const makeInstance = (config: AxiosConfig): CreatedInstance => {
  const inst = ((requestConfig: AxiosRequestConfig) => {
    instanceCalls.push(requestConfig)
    return Promise.resolve({ data: { ok: true } })
  }) as CreatedInstance
  inst.__config = config
  inst.defaults = { headers: { common: {} } }
  return inst
}

const mockCreate = jest.fn((config: AxiosConfig) => makeInstance(config))
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: (c: AxiosConfig) => mockCreate(c),
    CancelToken: {
      source: () => ({
        token: 'cancel-token',
        cancel: (msg: string) => cancelCalls.push(msg),
      }),
    },
  },
}))

type AxiosModule = typeof import('../axiosInstance')

const loadModule = async (): Promise<AxiosModule> => {
  let mod!: AxiosModule
  await jest.isolateModulesAsync(async () => {
    mod = await import('../axiosInstance')
  })
  return mod
}

const lastCreateConfig = (): AxiosConfig =>
  mockCreate.mock.calls[mockCreate.mock.calls.length - 1][0]

const ORIGINAL_ENV = process.env.CONFIG_API_BASE_URL

beforeEach(() => {
  mockCreate.mockClear()
  instanceCalls.length = 0
  cancelCalls.length = 0
  delete (window as { configApiBaseUrl?: string }).configApiBaseUrl
  delete process.env.CONFIG_API_BASE_URL
})

afterAll(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.CONFIG_API_BASE_URL
  else process.env.CONFIG_API_BASE_URL = ORIGINAL_ENV
})

describe('AXIOS_INSTANCE base url resolution', () => {
  it('prefers a valid window.configApiBaseUrl', async () => {
    ;(window as { configApiBaseUrl?: string }).configApiBaseUrl = 'https://runtime.example.com'
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    await loadModule()
    expect(lastCreateConfig().baseURL).toBe('https://runtime.example.com')
  })

  it('ignores an unresolved python-placeholder window url and falls back to env', async () => {
    ;(window as { configApiBaseUrl?: string }).configApiBaseUrl = '%(config_api_base_url)s'
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    await loadModule()
    expect(lastCreateConfig().baseURL).toBe('https://env.example.com')
  })

  it('falls back to the env url when no window url is present', async () => {
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    await loadModule()
    expect(lastCreateConfig().baseURL).toBe('https://env.example.com')
  })

  it('defaults to an empty base url when neither is set', async () => {
    await loadModule()
    expect(lastCreateConfig().baseURL).toBe('')
  })

  it('configures a 60s timeout', async () => {
    await loadModule()
    expect(lastCreateConfig().timeout).toBe(60000)
  })
})

describe('setApiToken', () => {
  it('sets a bearer Authorization header when given a token', async () => {
    const mod = await loadModule()
    mod.setApiToken('abc123')
    expect(mockCreate.mock.results[0].value.defaults.headers.common['Authorization']).toBe(
      'Bearer abc123',
    )
  })

  it('removes the Authorization header when given null', async () => {
    const mod = await loadModule()
    mod.setApiToken('abc123')
    mod.setApiToken(null)
    expect(
      mockCreate.mock.results[0].value.defaults.headers.common['Authorization'],
    ).toBeUndefined()
  })
})

describe('customInstance', () => {
  it('forwards the request through the axios instance and unwraps data', async () => {
    const mod = await loadModule()
    const result = await mod.customInstance<ResponsePayload>({ url: '/x', method: 'GET' })
    expect(result).toEqual({ ok: true })
    expect(instanceCalls[0]).toMatchObject({
      url: '/x',
      method: 'GET',
      cancelToken: 'cancel-token',
    })
  })

  it('passes an abort signal through to the request', async () => {
    const mod = await loadModule()
    const controller = new AbortController()
    await mod.customInstance<ResponsePayload>({ url: '/y' }, { signal: controller.signal })
    expect(instanceCalls[0].signal).toBe(controller.signal)
  })

  it('exposes a cancel() that cancels the underlying token source', async () => {
    const mod = await loadModule()
    // The public return type is Promise<T>; the implementation augments it with
    // cancel(), so narrow to CancellablePromise to reach it type-safely.
    const promise = mod.customInstance<ResponsePayload>({
      url: '/z',
    }) as CancellablePromise<ResponsePayload>
    promise.cancel?.()
    await promise
    expect(cancelCalls[0]).toBe('Operation canceled by the user.')
  })
})
