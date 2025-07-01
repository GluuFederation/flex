// @ts-nocheck

import devPolicyStoreJson from '../config/policy-store-dev.json'
import prodPolicyStoreJson from '../config/policy-store-prod.json'

export const generateCedarPolicies = (rolePermissionMapping) => {
  const policyStoreJson =
    process.env.NODE_ENV === 'production' ? prodPolicyStoreJson : devPolicyStoreJson
  const determineAction = (permission) => {
    if (permission.endsWith('.readonly') || permission.endsWith('.read')) {
      return 'Read'
    } else if (permission.endsWith('.write')) {
      return 'Write'
    } else if (permission.endsWith('.delete')) {
      return 'Delete'
    } else {
      return 'Execute'
    }
  }

  const formatPolicy = (role, action, resource) => {
    return `permit (
  principal in Jans::Role::"${role}",
  action in Jans::Action::"${action}",
  resource == Jans::Feature::"${resource.tag}"
);`
  }

  const storeId = Object.keys(policyStoreJson.policy_stores)[0]
  const policyStore = policyStoreJson.policy_stores[storeId]

  if (!policyStore.policies) {
    policyStore.policies = {}
  }

  // Remove policies with empty policy_content
  for (const [key, value] of Object.entries(policyStore.policies)) {
    if (!value.policy_content || value.policy_content.trim() === '') {
      delete policyStore.policies[key]
    }
  }

  rolePermissionMapping.forEach((entry) => {
    const { role, permissions } = entry

    permissions.forEach((permission) => {
      const action = determineAction(permission.name)
      const policy = formatPolicy(role, action, permission)
      const encoded = btoa(policy) // base64 encode
      const policyId = crypto.randomUUID() // Generate random ID

      policyStore.policies[policyId] = {
        description: `Policy for ${role} to ${action} ${permission}`,
        creation_date: new Date().toISOString(),
        policy_content: encoded,
      }
    })
  })

  return policyStoreJson
}
