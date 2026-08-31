export const POLICY_STORE_PATH = '/admin-ui/security/policyStore'

export const CJAR_EXTENSION = '.cjar'

export const POLICY_STORE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export const POLICY_STORE_ACTIVE_FILTER = `jansStatus=${POLICY_STORE_STATUS.ACTIVE}`
