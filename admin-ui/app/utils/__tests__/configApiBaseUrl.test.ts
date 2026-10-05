import { resolveConfigApiBaseUrl } from '@/utils/configApiBaseUrl'

const setWindowUrl = (value?: string): void => {
  if (value === undefined) delete (window as { configApiBaseUrl?: string }).configApiBaseUrl
  else (window as { configApiBaseUrl?: string }).configApiBaseUrl = value
}

const ORIGINAL_ENV = process.env.CONFIG_API_BASE_URL

beforeEach(() => {
  setWindowUrl(undefined)
  delete process.env.CONFIG_API_BASE_URL
})

afterAll(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.CONFIG_API_BASE_URL
  else process.env.CONFIG_API_BASE_URL = ORIGINAL_ENV
})

describe('resolveConfigApiBaseUrl', () => {
  it('prefers a valid window.configApiBaseUrl', () => {
    setWindowUrl('https://runtime.example.com')
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    expect(resolveConfigApiBaseUrl('N/A')).toBe('https://runtime.example.com')
  })

  it('ignores an un-substituted placeholder and falls back to the env url', () => {
    setWindowUrl('%(config_api_base_url)s')
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    expect(resolveConfigApiBaseUrl('N/A')).toBe('https://env.example.com')
  })

  it('returns the caller fallback when a placeholder is the only runtime value', () => {
    setWindowUrl('%(config_api_base_url)s')
    expect(resolveConfigApiBaseUrl('N/A')).toBe('N/A')
  })

  it('ignores an empty window url', () => {
    setWindowUrl('')
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    expect(resolveConfigApiBaseUrl('N/A')).toBe('https://env.example.com')
  })

  it('falls back to the env url when no window url is present', () => {
    process.env.CONFIG_API_BASE_URL = 'https://env.example.com'
    expect(resolveConfigApiBaseUrl('N/A')).toBe('https://env.example.com')
  })

  it('returns the caller fallback when neither source is set', () => {
    expect(resolveConfigApiBaseUrl('N/A')).toBe('N/A')
    expect(resolveConfigApiBaseUrl('http://localhost:8080')).toBe('http://localhost:8080')
  })
})
