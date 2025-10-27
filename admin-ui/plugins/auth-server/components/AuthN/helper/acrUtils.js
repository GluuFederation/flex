import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'

export const buildAgamaFlowsArray = (agamaList) => {
  const agamaFlows = []
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

export const buildDropdownOptions = (filteredScripts, agamaFlows) => {
  const scriptNames = filteredScripts.map((s) => s.key)

  return [...scriptNames, SIMPLE_PASSWORD_AUTH, ...agamaFlows].sort()
}
