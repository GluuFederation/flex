import React, { Suspense, lazy, ComponentType } from 'react'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'

// Component loading utility
export const createLazyComponent = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn)

  return (props: any) => (
    <Suspense fallback={<GluuSuspenseLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Pre-defined lazy components for better code splitting
export const LazyComponents = {
  // Large UI components
  MaterialTable: createLazyComponent(() => import('@material-table/core')),
  ReactAce: createLazyComponent(() => import('react-ace')),
  ReactJsonView: createLazyComponent(() =>
    import('react-json-view-lite').then((module) => ({ default: module.JsonView })),
  ),
  ReactGridLayout: createLazyComponent(() =>
    import('react-grid-layout').then((module) => ({ default: module.default })),
  ),

  // Chart components - recharts is typically used as named imports

  // Form components
  ReactDropzone: createLazyComponent(() => import('react-dropzone')),

  // Utility components
  ReactHelmet: createLazyComponent(() => import('react-helmet')),

  // Custom components
  GluuLoader: createLazyComponent(() => import('Routes/Apps/Gluu/GluuLoader')),
  GluuViewWrapper: createLazyComponent(() => import('Routes/Apps/Gluu/GluuViewWrapper')),
  GluuToast: createLazyComponent(() => import('Routes/Apps/Gluu/GluuToast')),
  GluuWebhookErrorDialog: createLazyComponent(
    () => import('Routes/Apps/Gluu/GluuWebhookErrorDialog'),
  ),
}

// Dynamic component loader
export const loadComponent = (componentPath: string) => {
  return createLazyComponent(() => import(`../${componentPath}`))
}

// Component preloading utility
export const preloadComponent = (componentName: keyof typeof LazyComponents) => {
  const component = LazyComponents[componentName]
  if (component && 'preload' in component) {
    ;(component as any).preload()
  }
}

// Batch preload multiple components
export const preloadComponents = (componentNames: (keyof typeof LazyComponents)[]) => {
  componentNames.forEach(preloadComponent)
}

// Conditional component loading
export const ConditionalComponent = ({
  condition,
  component,
  fallback = null,
}: {
  condition: boolean
  component: React.ComponentType<any>
  fallback?: React.ReactNode
}) => {
  if (!condition) return fallback
  return React.createElement(component)
}
