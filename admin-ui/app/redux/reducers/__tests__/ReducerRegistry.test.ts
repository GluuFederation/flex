import type { Reducer, UnknownAction } from '@reduxjs/toolkit'

type Registry = typeof import('../ReducerRegistry').default

// The module exports a singleton; isolateModulesAsync gives each test a fresh
// registry so accumulated registrations don't leak between cases.
const freshRegistry = async (): Promise<Registry> => {
  let registry!: Registry
  await jest.isolateModulesAsync(async () => {
    registry = (await import('../ReducerRegistry')).default
  })
  return registry
}

const noopReducer: Reducer<Record<string, never>, UnknownAction> = (state = {}) => state

describe('ReducerRegistry', () => {
  it('starts empty', async () => {
    expect((await freshRegistry()).getReducers()).toEqual({})
  })

  it('registers a reducer and exposes it through getReducers', async () => {
    const registry = await freshRegistry()
    registry.register('auth', noopReducer)
    expect(registry.getReducers()).toHaveProperty('auth', noopReducer)
  })

  it('returns a defensive copy from getReducers', async () => {
    const registry = await freshRegistry()
    registry.register('auth', noopReducer)
    const snapshot = registry.getReducers()
    ;(snapshot as Record<string, Reducer>).injected = noopReducer
    expect(registry.getReducers()).not.toHaveProperty('injected')
  })

  it('reports registered reducers via hasReducer / getReducer', async () => {
    const registry = await freshRegistry()
    registry.register('license', noopReducer)
    expect(registry.hasReducer('license')).toBe(true)
    expect(registry.hasReducer('missing')).toBe(false)
    expect(registry.getReducer('license' as never)).toBe(noopReducer)
  })

  it('notifies the change listener with the full reducer map on register', async () => {
    const registry = await freshRegistry()
    const listener = jest.fn()
    registry.setChangeListener(listener)
    registry.register('toast', noopReducer)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ toast: noopReducer }))
  })

  it('does not throw when registering before a listener is attached', async () => {
    const registry = await freshRegistry()
    expect(() => registry.register('preListener', noopReducer)).not.toThrow()
  })

  it('overwrites a reducer registered under an existing name', async () => {
    const registry = await freshRegistry()
    const replacement: Reducer<Record<string, number>, UnknownAction> = (state = { v: 1 }) => state
    registry.register('dup', noopReducer)
    registry.register('dup', replacement)
    expect(registry.getReducer('dup' as never)).toBe(replacement)
  })
})
