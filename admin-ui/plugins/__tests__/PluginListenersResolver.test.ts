// Control the plugin list and metadata so listener wiring can be asserted
// without touching Vite's glob loader.
jest.mock('../../plugins.config.json', () => [
  { order: 2, key: 'b', metadataFile: './b/plugin-metadata' },
  { order: 1, key: 'a', metadataFile: './a/plugin-metadata' },
])

const mockLoad = jest.fn()
jest.mock('../internal', () => ({ loadPluginMetadata: (p: string) => mockLoad(p) }))

import processListeners from '../PluginListenersResolver'

beforeEach(() => mockLoad.mockReset())

describe('PluginListenersResolver', () => {
  it('invokes every plugin listener setup with the startListening handle', () => {
    const startListening = jest.fn()
    const setupA = jest.fn()
    const setupB = jest.fn()
    mockLoad.mockImplementation((p: string) =>
      p.includes('/b/')
        ? { default: { listeners: [setupB] } }
        : { default: { listeners: [setupA] } },
    )
    processListeners(startListening as never)
    expect(setupA).toHaveBeenCalledWith(startListening)
    expect(setupB).toHaveBeenCalledWith(startListening)
  })

  it('is a no-op when plugins declare no listeners', () => {
    mockLoad.mockReturnValue({ default: {} })
    expect(() => processListeners(jest.fn() as never)).not.toThrow()
  })
})
