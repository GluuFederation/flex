import type { GenericItem } from '@/redux/types'
import type { AppConfiguration, Script } from '../../types'

export { generateLabel } from 'Plugins/auth-server/common/propertiesUtils'

export const isRenamedKey = (propKey: string, renamedLabel: string): boolean => {
  return propKey === renamedLabel
}

export const isScriptEntry = (item: GenericItem): item is Script => {
  return (
    typeof item.name === 'string' &&
    typeof item.scriptType === 'string' &&
    typeof item.enabled === 'boolean'
  )
}

export const renamedFieldFromObject = (
  obj: AppConfiguration,
  renamedLabel: string,
): AppConfiguration => {
  const { discoveryDenyKeys, ...rest } = obj

  return {
    ...rest,
    [renamedLabel]: discoveryDenyKeys ?? [],
  }
}

export const getMissingProperties = (
  properties: string[],
  apiConfigurations: string[],
): string[] => {
  return properties.filter(
    (property) => !apiConfigurations.some((configuration) => configuration === property),
  )
}
