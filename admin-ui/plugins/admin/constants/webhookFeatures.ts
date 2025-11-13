export const WEBHOOK_FEATURE_IDS = {
  OIDC_CLIENTS_WRITE: 'oidc_clients_write',
  OIDC_CLIENTS_DELETE: 'oidc_clients_delete',
  SCOPES_WRITE: 'scopes_write',
  SCOPES_DELETE: 'scopes_delete',
  CUSTOM_SCRIPT_WRITE: 'custom_script_write',
  CUSTOM_SCRIPT_DELETE: 'custom_script_delete',
  SAML_CONFIGURATION_WRITE: 'saml_configuration_write',
  SAML_IDP_WRITE: 'saml_idp_write',
  USERS_EDIT: 'users_edit',
} as const

export type WebhookFeatureId = (typeof WEBHOOK_FEATURE_IDS)[keyof typeof WEBHOOK_FEATURE_IDS]
