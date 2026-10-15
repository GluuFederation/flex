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

export const FEATURE_MENUS: readonly { feature: string; menu: string }[] = [
  { feature: adminUiFeatures.policy_store_edit, menu: 'menus.security' },
  { feature: adminUiFeatures.policy_store_delete, menu: 'menus.security' },
  { feature: adminUiFeatures.oidc_clients_write, menu: 'menus.oauthserver' },
  { feature: adminUiFeatures.oidc_clients_delete, menu: 'menus.oauthserver' },
  { feature: adminUiFeatures.scopes_write, menu: 'menus.oauthserver' },
  { feature: adminUiFeatures.scopes_delete, menu: 'menus.oauthserver' },
  { feature: adminUiFeatures.users_edit, menu: 'menus.users' },
  { feature: adminUiFeatures.users_delete, menu: 'menus.users' },
  { feature: adminUiFeatures.custom_script_write, menu: 'menus.scripts' },
  { feature: adminUiFeatures.custom_script_delete, menu: 'menus.scripts' },
  { feature: adminUiFeatures.attributes_write, menu: 'menus.user_claims' },
  { feature: adminUiFeatures.attributes_delete, menu: 'menus.user_claims' },
  { feature: adminUiFeatures.smtp_configuration_edit, menu: 'menus.smtp' },
  { feature: adminUiFeatures.scim_configuration_edit, menu: 'menus.scim' },
  { feature: adminUiFeatures.fido_configuration_write, menu: 'menus.fido' },
  { feature: adminUiFeatures.jans_link_write, menu: 'titles.jans_lock' },
  { feature: adminUiFeatures.saml_configuration_write, menu: 'menus.saml' },
  { feature: adminUiFeatures.saml_idp_write, menu: 'menus.saml' },
  { feature: adminUiFeatures.saml_delete, menu: 'menus.saml' },
]
