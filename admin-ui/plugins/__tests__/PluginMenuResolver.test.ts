// Control the plugin list and metadata so the menu/route aggregation, sort and
// error handling can be asserted without touching Vite's glob loader.
jest.mock('../../plugins.config.json', () => [
  { order: 2, key: 'b', metadataFile: './b/plugin-metadata' },
  { order: 1, key: 'a', metadataFile: './a/plugin-metadata' },
])

const mockLoad = jest.fn()
const mockLoadAsync = jest.fn()
jest.mock('../internal', () => ({
  loadPluginMetadata: (p: string) => mockLoad(p),
  loadPluginMetadataAsync: (p: string) => mockLoadAsync(p),
}))

const mockLoggerError = jest.fn()
jest.mock('@/utils/logger', () => ({
  logger: { error: (msg: string, err?: Error) => mockLoggerError(msg, err) },
}))

import { processMenus, processRoutes, processRoutesSync } from '../PluginMenuResolver'

beforeEach(() => {
  mockLoad.mockReset()
  mockLoadAsync.mockReset()
  mockLoggerError.mockReset()
})

describe('processMenus', () => {
  it('aggregates menus from every plugin and sorts them by order', async () => {
    mockLoadAsync.mockImplementation((p: string) =>
      p.includes('/b/')
        ? { default: { menus: [{ title: 'B', order: 5 }] } }
        : { default: { menus: [{ title: 'A', order: 1 }] } },
    )
    const menus = await processMenus()
    expect(menus.map((m) => (m as { title: string }).title)).toEqual(['A', 'B'])
  })

  it('treats a plugin with no menus as an empty contribution', async () => {
    mockLoadAsync.mockResolvedValue({ default: {} })
    expect(await processMenus()).toEqual([])
  })

  it('logs and skips a plugin whose metadata fails to load, keeping the rest', async () => {
    mockLoadAsync.mockImplementation((p: string) =>
      p.includes('/b/')
        ? Promise.reject(new Error('boom'))
        : Promise.resolve({ default: { menus: [{ title: 'A', order: 1 }] } }),
    )
    const menus = await processMenus()
    expect(menus).toHaveLength(1)
    expect(mockLoggerError).toHaveBeenCalledWith(
      expect.stringContaining('./b/plugin-metadata'),
      expect.any(Error),
    )
  })
})

describe('processRoutes', () => {
  it('aggregates routes from every plugin', async () => {
    mockLoadAsync.mockResolvedValue({ default: { routes: [{ path: '/x' }] } })
    expect(await processRoutes()).toHaveLength(2)
  })

  it('logs and skips a plugin whose routes fail to load', async () => {
    mockLoadAsync.mockImplementation((p: string) =>
      p.includes('/b/')
        ? Promise.reject(new Error('boom'))
        : Promise.resolve({ default: { routes: [{ path: '/a' }] } }),
    )
    expect(await processRoutes()).toEqual([{ path: '/a' }])
    expect(mockLoggerError).toHaveBeenCalled()
  })
})

describe('processRoutesSync', () => {
  it('aggregates routes synchronously and tolerates a throwing plugin', () => {
    mockLoad.mockImplementation((p: string) => {
      if (p.includes('/b/')) throw new Error('sync boom')
      return { default: { routes: [{ path: '/a' }] } }
    })
    expect(processRoutesSync()).toEqual([{ path: '/a' }])
    expect(mockLoggerError).toHaveBeenCalled()
  })
})
