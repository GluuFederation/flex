import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import type { Deployment } from 'JansConfigApi'

export interface DropdownOption {
  label: string
  value: string
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
