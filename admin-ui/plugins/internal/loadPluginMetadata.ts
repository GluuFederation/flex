import type { PluginMetadataModule } from './types'
import { REGEX_SCRIPT_EXTENSION } from '@/utils/regex'
import { devLogger } from '@/utils/devLogger'

let context: RequireContext | null = null
try {
  context = require.context('..', true, /plugin-metadata\.(?:tsx?|jsx?)$/)
} catch (err) {
  devLogger.error(
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

const createFallbackMetadata = (): PluginMetadataModule => ({
  default: { menus: [], routes: [] },
})

export const loadPluginMetadata = (path: string): PluginMetadataModule => {
  const normalized = path.replace(REGEX_SCRIPT_EXTENSION, '')
  const loader = moduleMap.get(normalized) ?? moduleMap.get(path)
  if (!loader) {
    devLogger.warn(
      `[loadPluginMetadata] No metadata found for path: "${path}" (normalized: "${normalized}"); using empty fallback`,
    )
    return createFallbackMetadata()
  }
  try {
    return loader()
  } catch (err) {
    devLogger.error(
      `[loadPluginMetadata] Loader failed for path: "${path}" (normalized: "${normalized}"); using empty fallback`,
      err,
    )
    return createFallbackMetadata()
  }
}
