import type { PluginMetadataModule } from './types'
import { REGEX_SCRIPT_EXTENSION } from '@/utils/regex'
import { devLogger } from '@/utils/devLogger'

const eagerModules = import.meta.glob<PluginMetadataModule>(
  '../**/plugin-metadata.{ts,tsx,js,jsx}',
  {
    eager: true,
  },
)

const normalizeModuleKey = (key: string): string => {
  const normalizedPrefix = key.startsWith('../') ? `.${key.slice(2)}` : key
  return normalizedPrefix.replace(REGEX_SCRIPT_EXTENSION, '')
}

const eagerModuleMap = new Map<string, PluginMetadataModule>()
Object.entries(eagerModules).forEach(([key, value]) => {
  eagerModuleMap.set(normalizeModuleKey(key), value as PluginMetadataModule)
})

const createFallbackMetadata = (): PluginMetadataModule => ({
  default: { menus: [], routes: [] },
})

export const loadPluginMetadata = (path: string): PluginMetadataModule => {
  const normalized = path.replace(REGEX_SCRIPT_EXTENSION, '')
  const metadata = eagerModuleMap.get(normalized) ?? eagerModuleMap.get(path)
  if (!metadata) {
    devLogger.warn(
      `[loadPluginMetadata] No metadata found for path: "${path}" (normalized: "${normalized}"); using empty fallback`,
    )
    return createFallbackMetadata()
  }
  try {
    return metadata
  } catch (err) {
    devLogger.error(
      `[loadPluginMetadata] Loader failed for path: "${path}" (normalized: "${normalized}"); using empty fallback`,
      err instanceof Error ? err : String(err),
    )
    return createFallbackMetadata()
  }
}

if (import.meta.hot) {
  import.meta.hot.accept()
}

export const loadPluginMetadataAsync = async (path: string): Promise<PluginMetadataModule> => {
  const normalized = path.replace(REGEX_SCRIPT_EXTENSION, '')
  const metadata = eagerModuleMap.get(normalized) ?? eagerModuleMap.get(path)
  if (!metadata) {
    devLogger.warn(
      `[loadPluginMetadata] No async metadata found for path: "${path}" (normalized: "${normalized}"); using empty fallback`,
    )
    return createFallbackMetadata()
  }
  try {
    return metadata
  } catch (err) {
    devLogger.error(
      `[loadPluginMetadata] Async loader failed for path: "${path}" (normalized: "${normalized}"); using empty fallback`,
      err instanceof Error ? err : String(err),
    )
    return createFallbackMetadata()
  }
}
