export const adminUiFeatures = {
  custom_script_write: 'custom_script_write',
  custom_script_delete: 'custom_script_delete',
  oidc_clients_delete: 'oidc_clients_delete',
  oidc_clients_write: 'oidc_clients_write',
  scopes_write: 'scopes_write',
  scopes_delete: 'scopes_delete',
  fido_configuration_write: 'fido_configuration_write',
  jans_link_write: 'jans_link_write',
  saml_configuration_write: 'saml_configuration_write',
  saml_idp_write: 'saml_idp_write',
  saml_delete: 'saml_idp_delete',
  attributes_write: 'attributes_write',
  attributes_delete: 'attributes_delete',
  scim_configuration_edit: 'scim_configuration_edit',
  smtp_configuration_edit: 'smtp_configuration_edit',
  users_edit: 'users_edit',
  users_delete: 'users_delete',
} as const

export type AdminUiFeatureKey = keyof typeof adminUiFeatures
