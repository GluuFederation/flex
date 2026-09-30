import { DEFAULT_SCRIPT_TYPE, SIMPLE_PASSWORD_AUTH } from '@/constants'
import type { Deployment, GluuLdapConfiguration } from 'JansConfigApi'
import type { GluuDetailGridField } from '@/components/GluuDetailGrid'
import type { AuthNItem, ConfigurationProperty, PropertyConfig } from '../../types'
import { EMPTY_PLACEHOLDER } from '../constants'
import { ACR_TYPES, AUTH_METHOD_NAMES, BUILT_IN_ACRS } from '../../constants'

export type DropdownOption = {
  label: string
  value: string
}

export const displayOrDash = (value: GluuDetailGridField['value']): GluuDetailGridField['value'] =>
  value === null || value === undefined || value === '' ? EMPTY_PLACEHOLDER : value

export const getPropertiesConfig = (entry: AuthNItem): PropertyConfig[] => {
  if (entry.configurationProperties && Array.isArray(entry.configurationProperties)) {
    return entry.configurationProperties.map((e) => ({
      id: crypto.randomUUID(),
      key: e.key || e.value1 || '',
      value: e.value || e.value2 || '',
    }))
  }
  return []
}

export const isDefaultAuthNMethod = (value: boolean | string): boolean =>
  value === 'true' || value === true

export const transformConfigurationProperties = (
  properties: ConfigurationProperty[] | undefined,
): Array<{ value1: string; value2: string; hide: boolean }> => {
  if (!properties || properties.length === 0) {
    return []
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

type ScriptOption = {
  key: string
  value: string
}

const AGAMA_ACR_PREFIX = 'agama_'

const getLaunchableFlows = (deployment: Deployment): string[] => {
  const details = deployment?.details
  const flows = details?.flowsError
  if (!flows) return []
  const noDirectLaunch = new Set(details.projectMetadata?.noDirectLaunch ?? [])
  return Object.entries(flows)
    .filter(([flow, error]) => !error && !noDirectLaunch.has(flow))
    .map(([flow]) => flow)
}

export const buildAgamaAcrItems = (deployments: Deployment[] | undefined): AuthNItem[] => {
  if (!Array.isArray(deployments)) return []
  return deployments.flatMap((deployment) => {
    const agamaProject = deployment?.details?.projectMetadata?.projectName || deployment?.id
    return getLaunchableFlows(deployment).map((flow) => ({
      acrName: `${AGAMA_ACR_PREFIX}${flow}`,
      name: flow,
      acrType: ACR_TYPES.AGAMA,
      agamaProject,
    }))
  })
}

export const buildAgamaFlowsArray = (agamaList: Deployment[]): string[] => {
  if (!Array.isArray(agamaList)) return []
  return agamaList.flatMap((deployment) =>
    getLaunchableFlows(deployment).map((flow) => `${AGAMA_ACR_PREFIX}${flow}`),
  )
}

const byLevel = (a: AuthNItem, b: AuthNItem): number => (a.level || 0) - (b.level || 0)

const byAcrName = (a: AuthNItem, b: AuthNItem): number =>
  (a.acrName ?? '').localeCompare(b.acrName ?? '')

const toLdapAcrItem = (config: GluuLdapConfiguration): AuthNItem => ({
  configId: config.configId,
  bindDN: config.bindDN,
  bindPassword: config.bindPassword,
  servers: config.servers,
  maxConnections: config.maxConnections,
  useSSL: config.useSSL,
  baseDNs: config.baseDNs,
  primaryKey: config.primaryKey,
  localPrimaryKey: config.localPrimaryKey,
  enabled: config.enabled,
  level: config.level,
  name: AUTH_METHOD_NAMES.DEFAULT_LDAP,
  acrName: config.configId,
  acrType: ACR_TYPES.LDAP,
})

const toScriptAcrItem = (script: AuthNItem): AuthNItem => ({
  ...script,
  name: script.scriptType || DEFAULT_SCRIPT_TYPE,
  acrName: script.name,
  isCustomScript: true,
  acrType: ACR_TYPES.SCRIPT,
})

type AcrTableSources = {
  ldapConfigurations?: GluuLdapConfiguration[]
  scripts?: AuthNItem[]
  deployments?: Deployment[]
}

export const buildAcrTableRows = ({
  ldapConfigurations = [],
  scripts = [],
  deployments,
}: AcrTableSources): AuthNItem[] => {
  const levelled = [
    ...ldapConfigurations.filter((config) => config.enabled === true).map(toLdapAcrItem),
    ...scripts.filter((script) => script.enabled === true).map(toScriptAcrItem),
  ].sort(byLevel)
  return [...BUILT_IN_ACRS, ...levelled, ...buildAgamaAcrItems(deployments).sort(byAcrName)]
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
