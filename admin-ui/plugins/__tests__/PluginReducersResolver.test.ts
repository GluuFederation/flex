// Control the plugin list and metadata so reducer registration/dedup can be
// asserted without touching Vite's glob loader or the real store.
jest.mock('../../plugins.config.json', () => [
  { order: 2, key: 'b', metadataFile: './b/plugin-metadata' },
  { order: 1, key: 'a', metadataFile: './a/plugin-metadata' },
])

const mockLoad = jest.fn()
jest.mock('../internal', () => ({ loadPluginMetadata: (p: string) => mockLoad(p) }))

const mockRegister = jest.fn()
jest.mock('Redux/reducers/ReducerRegistry', () => ({
  __esModule: true,
  default: { register: (name: string, reducer: jest.Mock) => mockRegister(name, reducer) },
}))

import processReducers from '../PluginReducersResolver'

beforeEach(() => {
  mockLoad.mockReset()
  mockRegister.mockReset()
})

describe('PluginReducersResolver', () => {
  it('registers each plugin reducer exactly once, de-duplicating by name', () => {
    const r1 = jest.fn()
    const r2 = jest.fn()
    mockLoad.mockImplementation((p: string) =>
      p.includes('/b/')
        ? { default: { reducers: [{ name: 'shared', reducer: r2 }] } } // duplicate name
        : {
            default: {
              reducers: [
                { name: 'shared', reducer: r1 },
                { name: 'unique', reducer: r2 },
              ],
            },
          },
    )
    processReducers()
    const names = mockRegister.mock.calls.map((c) => c[0])
    expect(names).toEqual(['shared', 'unique'])
  })

  it('does nothing when plugins expose no reducers', () => {
    mockLoad.mockReturnValue({ default: {} })
    processReducers()
    expect(mockRegister).not.toHaveBeenCalled()
  })
})
