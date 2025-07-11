jest.spyOn(global.console, 'log').mockImplementation(jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn())
jest.setTimeout(30000)
HTMLAnchorElement.prototype.click = jest.fn()
global.window.URL.createObjectURL = jest.fn()
// Polyfill "window.fetch" used in the React component.
global.ResizeObserver = require('resize-observer-polyfill')
import 'whatwg-fetch'
import '@testing-library/jest-dom'

it('Jans-admin UI test setup', () => {
  expect(true).toBeTruthy()
})
