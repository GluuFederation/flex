import React, { Suspense, lazy, ComponentType } from 'react'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'

// Plugin loading utility
export const createLazyPlugin = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn)

  return (props: any) => (
    <Suspense fallback={<GluuSuspenseLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// Dynamic plugin loader for routes
export const loadPluginRoute = (pluginName: string) => {
  return createLazyPlugin(() =>
    import(
      `../../plugins/${pluginName}/components/${pluginName.charAt(0).toUpperCase() + pluginName.slice(1)}`
    ).catch(() => {
      // Fallback to default component if specific component doesn't exist
      return import(`../../plugins/${pluginName}/components/index`)
    }),
  )
}

// Dynamic plugin loader for components
export const loadPluginComponent = (pluginName: string, componentName: string) => {
  return createLazyPlugin(() => import(`../../plugins/${pluginName}/components/${componentName}`))
}

// Plugin metadata loader
export const loadPluginMetadata = async (pluginName: string) => {
  try {
    const metadata = await import(`../../plugins/${pluginName}/plugin-metadata`)
    return metadata.default
  } catch (error) {
    console.warn(`Failed to load metadata for plugin: ${pluginName}`, error)
    return null
  }
}

// Batch load multiple plugins
export const loadPlugins = async (pluginNames: string[]) => {
  const pluginPromises = pluginNames.map((name) => loadPluginMetadata(name))
  const results = await Promise.allSettled(pluginPromises)

  return results
    .map((result, index) => ({
      name: pluginNames[index],
      metadata: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }))
    .filter((plugin) => plugin.metadata !== null)
}
