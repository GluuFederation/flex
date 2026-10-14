import { adminUiFeatures } from '@/constants'

export const WEBHOOK_FIELDS = {
  DISPLAY_NAME: 'displayName',
  URL: 'url',
  HTTP_METHOD: 'httpMethod',
  HTTP_HEADERS: 'httpHeaders',
  HTTP_REQUEST_BODY: 'httpRequestBody',
  JANS_ENABLED: 'jansEnabled',
} as const

export type ShortcodeFieldName = typeof WEBHOOK_FIELDS.URL | typeof WEBHOOK_FIELDS.HTTP_REQUEST_BODY

export const FEATURE_MENU_ORDER: readonly string[] = [
  adminUiFeatures.policy_store_edit,
  adminUiFeatures.policy_store_delete,
  adminUiFeatures.oidc_clients_write,
  adminUiFeatures.oidc_clients_delete,
  adminUiFeatures.scopes_write,
  adminUiFeatures.scopes_delete,
  adminUiFeatures.users_edit,
  adminUiFeatures.users_delete,
  adminUiFeatures.custom_script_write,
  adminUiFeatures.custom_script_delete,
  adminUiFeatures.attributes_write,
  adminUiFeatures.attributes_delete,
  adminUiFeatures.smtp_configuration_edit,
  adminUiFeatures.scim_configuration_edit,
  adminUiFeatures.fido_configuration_write,
  adminUiFeatures.jans_link_write,
  adminUiFeatures.saml_configuration_write,
  adminUiFeatures.saml_idp_write,
  adminUiFeatures.saml_delete,
]
