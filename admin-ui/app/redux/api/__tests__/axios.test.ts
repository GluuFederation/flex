// axios.ts resolves its baseURL at module load, so each scenario sets the
// relevant globals, resets the module registry, then re-imports to observe the
// config passed to axios.create.
type AxiosConfig = { baseURL: string; timeout: number }
type AxiosInstance = { __instance: true; config: AxiosConfig }

const mockCreate = jest.fn((config: AxiosConfig): AxiosInstance => ({ __instance: true, config }))
jest.mock('axios', () => ({
  __esModule: true,
  default: { create: (c: AxiosConfig) => mockCreate(c) },
}))

const ORIGINAL_ENV = process.env.CONFIG_API_BASE_URL

const loadAxios = async (): Promise<AxiosInstance> => {
  let instance!: AxiosInstance
  await jest.isolateModulesAsync(async () => {
    const mod: { default: object } = await import('../axios')
    instance = mod.default as AxiosInstance
  })
  return instance
}

const lastConfig = (): AxiosConfig => mockCreate.mock.calls[mockCreate.mock.calls.length - 1][0]

const setWindowUrl = (value?: string) => {
  ;(window as { configApiBaseUrl?: string }).configApiBaseUrl = value
}

beforeEach(() => {
  mockCreate.mockClear()
  delete (window as { configApiBaseUrl?: string }).configApiBaseUrl
  delete process.env.CONFIG_API_BASE_URL
})

afterAll(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.CONFIG_API_BASE_URL
  else process.env.CONFIG_API_BASE_URL = ORIGINAL_ENV
})

describe('axios instance', () => {
  it('prefers a valid window.configApiBaseUrl', async () => {
    setWindowUrl('https://runtime.example.com')
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    await loadAxios()
    expect(lastConfig().baseURL).toBe('https://runtime.example.com')
  })

  it('ignores an unresolved python-placeholder window url and falls back to the env url', async () => {
    setWindowUrl('%(config_api_base_url)s')
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    await loadAxios()
    expect(lastConfig().baseURL).toBe('https://env.example.com')
  })

  it('falls back to the env url when no window url is present', async () => {
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    await loadAxios()
    expect(lastConfig().baseURL).toBe('https://env.example.com')
  })

  it('falls back to localhost when neither window nor env url is set', async () => {
    await loadAxios()
    expect(lastConfig().baseURL).toBe('http://localhost:8080')
  })

  it('configures a 60s timeout on the created instance', async () => {
    await loadAxios()
    expect(lastConfig().timeout).toBe(60000)
  })

  it('exports the created axios instance', async () => {
    const instance = await loadAxios()
    expect(instance.__instance).toBe(true)
  })
})
