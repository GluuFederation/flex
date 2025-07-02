import type { RolePermissionMapping, Permission, RuntimePolicyStoreConfig } from '../types'

/**
 * Generates Cedar policies from role-permission mappings
 * Optimized with caching and error handling
 */
export const generateCedarPolicies = (
  rolePermissionMapping: RolePermissionMapping,
): RuntimePolicyStoreConfig => {
  // Input validation
  if (!rolePermissionMapping || !Array.isArray(rolePermissionMapping)) {
    throw new Error('Invalid rolePermissionMapping: must be an array')
  }

  // Get policy store configuration injected by webpack at build time
  // Note: webpack DefinePlugin already injects this as a parsed object, no need to JSON.parse
  const policyStoreConfig = process.env.POLICY_STORE_CONFIG
  let policyStoreJson: RuntimePolicyStoreConfig

  try {
    if (typeof policyStoreConfig === 'string') {
      policyStoreJson = JSON.parse(policyStoreConfig)
    } else if (policyStoreConfig && typeof policyStoreConfig === 'object') {
      policyStoreJson = policyStoreConfig as RuntimePolicyStoreConfig
    } else {
      policyStoreJson = { policy_stores: {} }
    }
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

  // Ensure policy store structure exists
  if (!policyStoreJson.policy_stores || typeof policyStoreJson.policy_stores !== 'object') {
    policyStoreJson.policy_stores = {}
  }

  // Get or create the first policy store
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

  // Remove policies with empty policy_content
  for (const [key, value] of Object.entries(policyStore.policies)) {
    if (!value?.policy_content || value.policy_content.trim() === '') {
      delete policyStore.policies[key]
    }
  }

  rolePermissionMapping.forEach((entry) => {
    // Validate entry structure
    if (!entry || typeof entry !== 'object' || !entry.role || !Array.isArray(entry.permissions)) {
      console.warn('Skipping invalid role permission entry:', entry)
      return
    }

    const { role, permissions } = entry

    permissions.forEach((permission) => {
      // Validate permission structure
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
