jest.spyOn(global.console, 'log').mockImplementation(jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn())
jest.setTimeout(30000);
// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch'
import '@testing-library/jest-dom'

it('Jans-admin UI test setup', () => {
  expect(true).toBeTruthy()
})
