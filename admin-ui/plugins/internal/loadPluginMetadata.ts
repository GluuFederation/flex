import type { PluginMetadataModule } from './types'
import { REGEX_SCRIPT_EXTENSION } from '@/utils/regex'

let context: RequireContext | null = null
try {
  context = require.context('..', true, /plugin-metadata\.(?:tsx?|jsx?)$/)
} catch (err) {
  console.error(
    '[loadPluginMetadata] require.context failed; no plugin metadata will be available',
    err,
  )
  context = null
}

const moduleMap = new Map<string, () => PluginMetadataModule>()
if (context) {
  const ctx = context
  ctx.keys().forEach((key) => {
    const stripped = key.replace(REGEX_SCRIPT_EXTENSION, '')
    moduleMap.set(stripped, () => ctx<PluginMetadataModule>(key))
  })
}

const FALLBACK_METADATA: PluginMetadataModule = { default: { menus: [], routes: [] } }

export const loadPluginMetadata = (path: string): PluginMetadataModule => {
  const normalized = path.replace(REGEX_SCRIPT_EXTENSION, '')
  const loader = moduleMap.get(normalized) ?? moduleMap.get(path)
  if (!loader) {
    console.warn(
      `[loadPluginMetadata] No metadata found for path: "${path}" (normalized: "${normalized}"); using empty fallback`,
    )
    return FALLBACK_METADATA
  }
  return loader()
}
