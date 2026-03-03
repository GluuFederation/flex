import ResizeObserverPolyfill from 'resize-observer-polyfill'
import 'whatwg-fetch'
import '@testing-library/jest-dom'
import i18n from '../app/i18n'

const originalError = console.error.bind(console)

beforeAll(async () => {
  if (!i18n.isInitialized) {
    try {
      await i18n.init()
    } catch (error) {
      console.error('i18n.init() failed:', (error as Error).message, (error as Error).stack)
      throw error
    }
  }
})

afterAll(() => {
  jest.restoreAllMocks()
})

jest.spyOn(global.console, 'log').mockImplementation(jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn())

jest.spyOn(global.console, 'error').mockImplementation((...args: unknown[]) => {
  const msg = args.map((a) => String(a ?? '')).join(' ')
  const shouldSuppress =
    msg.includes('Problems getting API access token') ||
    msg.includes('Problems posting user action audit log') ||
    msg.includes('suspended resource finished loading') ||
    msg.includes('not wrapped in act(') ||
    (msg.includes('Failed prop type') && msg.includes('timeout') && msg.includes('Fade'))

  if (shouldSuppress) return
  originalError(...args)
})

jest.setTimeout(30000)

jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(jest.fn())
if (typeof globalThis.URL !== 'undefined') {
  if ('createObjectURL' in globalThis.URL) {
    jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(jest.fn())
  } else {
    Object.defineProperty(globalThis.URL, 'createObjectURL', {
      value: jest.fn(),
      configurable: true,
      writable: true,
    })
  }
}

global.ResizeObserver = ResizeObserverPolyfill
