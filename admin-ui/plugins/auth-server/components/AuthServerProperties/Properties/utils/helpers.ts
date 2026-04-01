import type { GenericItem } from '@/redux/types'
import type { AppConfiguration, Script } from '../../types'

export function generateLabel(name: string): string {
  const result = name.replace(/([A-Z])/g, ' $1').trim()
  if (!result) return ''
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function isRenamedKey(propKey: string): boolean {
  return propKey === 'OpenID Configuration Response OP Metadata Suppression List'
}

export function isScriptEntry(item: GenericItem): item is Script {
  return (
    typeof item.name === 'string' &&
    typeof item.scriptType === 'string' &&
    typeof item.enabled === 'boolean'
  )
}

export function renamedFieldFromObject(obj: AppConfiguration): AppConfiguration {
  const { discoveryDenyKeys, ...rest } = obj

  return {
    ...rest,
    'OpenID Configuration Response OP Metadata Suppression List': discoveryDenyKeys ?? [],
  }
}

export function getMissingProperties(properties: string[], apiConfigurations: string[]): string[] {
  return properties.filter(
    (property) => !apiConfigurations.some((configuration) => configuration === property),
  )
}
