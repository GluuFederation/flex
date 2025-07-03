import type {
  RolePermissionMapping,
  Permission,
  RuntimePolicyStoreConfig,
  ExtendedPolicyStoreConfig,
} from '../types'

const baseUrl = window.configApiBaseUrl || process.env.CONFIG_API_BASE_URL

const updateOpenIdConfigurationEndpoint = (
  policyStoreJson: ExtendedPolicyStoreConfig,
): ExtendedPolicyStoreConfig => {
  let hostname = 'localhost'

  const appBaseUrl = baseUrl || 'http://localhost:8080'

  try {
    const url = new URL(appBaseUrl)
    hostname = url.hostname
  } catch (error) {
    console.warn('Failed to parse baseUrl:', error)
  }
  try {
    const policyStores = policyStoreJson.policy_stores
    if (!policyStores || typeof policyStores !== 'object') {
      console.warn('Policy stores not found or invalid')
      return policyStoreJson
    }

    for (const storeId of Object.keys(policyStores)) {
      const store = policyStores[storeId]

      if (!store.trusted_issuers || typeof store.trusted_issuers !== 'object') {
        continue
      }

      for (const issuerId of Object.keys(store.trusted_issuers)) {
        const issuer = store.trusted_issuers[issuerId]
        if (issuer && typeof issuer === 'object') {
          if (issuer.openid_configuration_endpoint && baseUrl) {
            issuer.openid_configuration_endpoint = baseUrl.replace('%(hostname)s', hostname)
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to update OpenID Configuration endpoint:', error)
  }

  return policyStoreJson
}

export const generateCedarPolicies = (
  rolePermissionMapping: RolePermissionMapping,
): RuntimePolicyStoreConfig => {
  // Input validation
  if (!rolePermissionMapping || !Array.isArray(rolePermissionMapping)) {
    throw new Error('Invalid rolePermissionMapping: must be an array')
  }

  const policyStoreConfig = process.env.POLICY_STORE_CONFIG
  let policyStoreJson: RuntimePolicyStoreConfig

  try {
    let initialPolicyJson: unknown

    if (typeof policyStoreConfig === 'string') {
      initialPolicyJson = JSON.parse(policyStoreConfig)
    } else if (policyStoreConfig && typeof policyStoreConfig === 'object') {
      initialPolicyJson = policyStoreConfig
    } else {
      initialPolicyJson = { policy_stores: {} }
    }

    const extendedConfig = initialPolicyJson as ExtendedPolicyStoreConfig

    const updatedConfig = updateOpenIdConfigurationEndpoint(extendedConfig)
    policyStoreJson = updatedConfig as unknown as RuntimePolicyStoreConfig
  } catch (error) {
    console.warn('Failed to parse POLICY_STORE_CONFIG, using default structure:', error)
    policyStoreJson = { policy_stores: {} }
  }

  const determineAction = (permission: string): string => {
    if (
      permission.endsWith('readonly') ||
      permission.endsWith('read') ||
      permission.endsWith('read-all') ||
      permission.endsWith('search')
    ) {
      return 'Read'
    } else if (permission.endsWith('write')) {
      return 'Write'
    } else if (permission.endsWith('delete')) {
      return 'Delete'
    } else {
      return 'Execute'
    }
  }

  const formatPolicy = (role: string, action: string, resource: Permission): string => {
    return `permit (
  principal in Jans::Role::"${role}",
  action in Jans::Action::"${action}",
  resource == Jans::Feature::"${resource.tag}"
);`
  }

  if (!policyStoreJson.policy_stores || typeof policyStoreJson.policy_stores !== 'object') {
    policyStoreJson.policy_stores = {}
  }

  const storeIds = Object.keys(policyStoreJson.policy_stores)
  let storeId = storeIds[0]

  if (!storeId) {
    storeId = 'default-store'
    policyStoreJson.policy_stores[storeId] = { policies: {} }
  }

  const policyStore = policyStoreJson.policy_stores[storeId]

  if (!policyStore?.policies || typeof policyStore.policies !== 'object') {
    policyStore.policies = {}
  }
  for (const [key, value] of Object.entries(policyStore.policies)) {
    if (!value?.policy_content || value.policy_content.trim() === '') {
      delete policyStore.policies[key]
    }
  }

  rolePermissionMapping.forEach((entry) => {
    if (!entry || typeof entry !== 'object' || !entry.role || !Array.isArray(entry.permissions)) {
      console.warn('Skipping invalid role permission entry:', entry)
      return
    }

    const { role, permissions } = entry

    permissions.forEach((permission) => {
      if (!permission || typeof permission !== 'object' || !permission.name || !permission.tag) {
        console.warn('Skipping invalid permission:', permission)
        return
      }

      try {
        const action = determineAction(permission.name)
        const policy = formatPolicy(role, action, permission)
        const encoded = btoa(policy) // base64 encode
        const policyId = crypto.randomUUID() // Generate random ID

        policyStore.policies[policyId] = {
          description: `Policy for ${role} to ${action} ${permission.name}`,
          creation_date: new Date().toISOString(),
          policy_content: encoded,
        }
      } catch (error) {
        console.error(
          `Failed to generate policy for role ${role}, permission ${permission.name}:`,
          error,
        )
      }
    })
  })

  return policyStoreJson
}
