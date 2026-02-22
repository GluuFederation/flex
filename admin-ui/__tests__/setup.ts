import ResizeObserverPolyfill from 'resize-observer-polyfill'
import 'whatwg-fetch'
import '@testing-library/jest-dom'
import i18n from '../app/i18n'

const originalError = console.error.bind(console)

beforeAll(async () => {
  if (!i18n.isInitialized) {
    await i18n.init()
  }
})

jest.spyOn(global.console, 'log').mockImplementation(jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn())

jest.spyOn(global.console, 'error').mockImplementation((...args: unknown[]) => {
  const msg = args.map((a) => String(a ?? '')).join(' ')
  const shouldSuppress =
    msg.includes('Problems getting API access token') ||
    msg.includes('Problems posting user action audit log') ||
    msg.includes('_t is not a function') ||
    msg.includes('was not wrapped in act') ||
    msg.includes('suspended resource finished loading') ||
    (msg.includes('Failed prop type') && msg.includes('timeout') && msg.includes('Fade'))

  if (shouldSuppress) return
  originalError(...args)
})

jest.setTimeout(30000)

HTMLAnchorElement.prototype.click = jest.fn()
;(
  globalThis as unknown as { window: { URL: { createObjectURL: () => void } } }
).window.URL.createObjectURL = jest.fn()

global.ResizeObserver = ResizeObserverPolyfill

it('Jans-admin UI test setup', () => {
  expect(true).toBeTruthy()
})
