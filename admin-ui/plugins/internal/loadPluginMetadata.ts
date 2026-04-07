import type { PluginMetadataModule } from './types'

let context: RequireContext | null = null
try {
  context = require.context('..', true, /plugin-metadata\.(?:tsx?|jsx?)$/)
} catch {
  context = null
}

const moduleMap = new Map<string, () => PluginMetadataModule>()
if (context) {
  const ctx = context
  ctx.keys().forEach((key) => {
    const stripped = key.replace(/\.(?:tsx?|jsx?)$/, '')
    moduleMap.set(stripped, () => ctx(key) as PluginMetadataModule)
  })
}

export const loadPluginMetadata = (path: string): PluginMetadataModule => {
  const loader = moduleMap.get(path)
  if (!loader) {
    throw new Error(`Plugin metadata not found for path: ${path}`)
  }
  return loader()
}
