import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'

/**
 * Build agama flows array from agama list
 * Extracts individual flows that are not in noDirectLaunch and adds agama_ prefix
 * Each flow becomes a separate entry
 * @param {Array} agamaList - List of agama deployments
 * @returns {Array} Array of qualified flow names
 */
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

/**
 * Build dropdown options array
 * Combines scripts, SIMPLE_PASSWORD_AUTH, and individual agama flows into sorted array
 * Each entry maps to itself (display name = value)
 * @param {Array} filteredScripts - Filtered authentication scripts
 * @param {Array} agamaFlows - Array of agama flows
 * @returns {Array} Sorted array of dropdown options
 */
export const buildDropdownOptions = (filteredScripts, agamaFlows) => {
  const scriptNames = filteredScripts.map((s) => s.key)

  return [...scriptNames, SIMPLE_PASSWORD_AUTH, ...agamaFlows].sort()
}
