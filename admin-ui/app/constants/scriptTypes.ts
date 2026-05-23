export const SCRIPT_TYPES = {
  PERSON_AUTHENTICATION: 'person_authentication',
  SPONTANEOUS_SCOPE: 'spontaneous_scope',
  UPDATE_TOKEN: 'update_token',
  POST_AUTHN: 'post_authn',
  INTROSPECTION: 'introspection',
  ROPC: 'resource_owner_password_credentials',
  CONSENT_GATHERING: 'consent_gathering',
  UMA_RPT_CLAIMS: 'uma_rpt_claims',
  DYNAMIC_SCOPE: 'dynamic_scope',
  UMA_RPT_POLICY: 'uma_rpt_policy',
} as const

export const DEFAULT_SCRIPT_TYPE = SCRIPT_TYPES.PERSON_AUTHENTICATION
