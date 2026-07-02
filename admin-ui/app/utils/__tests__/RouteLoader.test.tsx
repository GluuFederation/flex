import React, { Suspense } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { createLazyRoute, LazyRoutes } from '../RouteLoader'

describe('createLazyRoute', () => {
  it('attaches a preload method that invokes the import function', async () => {
    const Loaded = () => <div>loaded</div>
    const importFn = jest.fn(() => Promise.resolve({ default: Loaded }))
    const route = createLazyRoute(importFn)

    await route.preload()
    expect(importFn).toHaveBeenCalledTimes(1)
  })

  it('produces a lazily-rendered component that resolves to the imported module', async () => {
    const Loaded = () => <div>lazy-content</div>
    const Route = createLazyRoute(() => Promise.resolve({ default: Loaded }))

    render(
      <Suspense fallback={<div>loading</div>}>
        <Route />
      </Suspense>,
    )
    expect(screen.getByText('loading')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('lazy-content')).toBeInTheDocument())
  })

  it('reuses the same import function reference for preload', () => {
    const importFn = jest.fn(() => Promise.resolve({ default: () => null }))
    const route = createLazyRoute(importFn)
    route.preload()
    route.preload()
    expect(importFn).toHaveBeenCalledTimes(2)
  })
})

describe('LazyRoutes registry', () => {
  const expectedRoutes = [
    'DashboardPage',
    'ProfilePage',
    'Gluu404Error',
    'ByeBye',
    'GluuNavBar',
    'DefaultSidebar',
    'GluuToast',
    'GluuWebhookExecutionDialog',
  ] as const

  it.each(expectedRoutes)('exposes %s as a preloadable lazy route', (name) => {
    const route = LazyRoutes[name as keyof typeof LazyRoutes]
    expect(route).toBeDefined()
    expect(typeof route.preload).toBe('function')
  })

  it('registers exactly the expected set of routes', () => {
    expect(Object.keys(LazyRoutes).sort()).toEqual([...expectedRoutes].sort())
  })
})
