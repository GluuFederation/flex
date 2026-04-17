import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import type { Deployment } from 'JansConfigApi'
import type { GluuDetailGridField } from '@/components/GluuDetailGrid'
import type { AuthNItem, ConfigurationProperty } from '../../atoms'
import { EMPTY_PLACEHOLDER } from '../constants'

export interface DropdownOption {
  label: string
  value: string
}

export type PropertyConfig = {
  id: string
  key: string
  value: string
}

export const displayOrDash = (value: GluuDetailGridField['value']): GluuDetailGridField['value'] =>
  value === null || value === undefined || value === '' ? EMPTY_PLACEHOLDER : value

export const getPropertiesConfig = (entry: AuthNItem): PropertyConfig[] => {
  if (entry.configurationProperties && Array.isArray(entry.configurationProperties)) {
    return entry.configurationProperties.map((e) => ({
      id: crypto.randomUUID(),
      key: e.value1 || '',
      value: e.value2 || '',
    }))
  }
  return []
}

export const isDefaultAuthNMethod = (value: boolean | string): boolean =>
  value === 'true' || value === true

export const transformConfigurationProperties = (
  properties: ConfigurationProperty[] | undefined,
): Array<{ value1: string; value2: string; hide: boolean }> | undefined => {
  if (!properties || properties.length === 0) {
    return undefined
  }
  return properties
    .filter((e): e is ConfigurationProperty => e != null)
    .filter((e) => Object.keys(e).length !== 0)
    .map((e) => ({
      value1: e.key || e.value1 || '',
      value2: e.value || e.value2 || '',
      hide: false,
    }))
}

interface ScriptOption {
  key: string
  value: string
}

export const buildAgamaFlowsArray = (agamaList: Deployment[]): string[] => {
  const agamaFlows: string[] = []
  if (Array.isArray(agamaList)) {
    agamaList.forEach((flow) => {
      const configs = flow?.details?.projectMetadata?.configs
      const noDirectLaunch = flow?.details?.projectMetadata?.noDirectLaunch || []

      if (configs) {
        Object.keys(configs).forEach((key) => {
          if (!noDirectLaunch.includes(key)) {
            const qualifiedName = `agama_${key}`
            agamaFlows.push(qualifiedName)
          }
        })
      }
    })
  }
  return agamaFlows
}

export const buildDropdownOptions = (
  filteredScripts: ScriptOption[],
  agamaFlows: string[],
): DropdownOption[] => {
  return [
    { label: `${SIMPLE_PASSWORD_AUTH} (builtin)`, value: SIMPLE_PASSWORD_AUTH },
    ...filteredScripts
      .map((s) => ({ label: `${s.key} (script)`, value: s.key }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    ...agamaFlows
      .map((flow) => ({ label: `${flow} (agama)`, value: flow }))
      .sort((a, b) => a.value.localeCompare(b.value)),
  ]
}
