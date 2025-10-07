// LDAP constants
export const LDAP_READ = 'LDAP_READ'
export const LDAP_WRITE = 'LDAP_WRITE'
export const LDAP_DELETE = 'LDAP_DELETE'

export const ACTIONS = {
  EDIT_LDAP: 'authNLdap/editLdap',
  ADD_LDAP: 'authNLdap/addLdap',
  DELETE_LDAP: 'authNLdap/deleteLdap',
}

export const FEATURES = {
  LDAP_EDIT: 'ldap_edit',
  LDAP_DELETE: 'ldap_delete',
  LDAP_ADD: 'ldap_add',
}

export const STRINGS = {
  authn: {
    ldap: {
      fields: {
        acr: 'tooltips.authn.ldap.fields.acr',
        bind_dn: 'tooltips.authn.ldap.fields.bind_dn',
        bind_password: 'tooltips.authn.ldap.fields.bind_password',
        remote_ldap_server: 'tooltips.authn.ldap.fields.remote_ldap_server',
        max_connections: 'tooltips.authn.ldap.fields.max_connections',
        base_dns: 'tooltips.authn.ldap.fields.base_dns',
        remote_primary_key: 'tooltips.authn.ldap.fields.remote_primary_key',
        local_primary_key: 'tooltips.authn.ldap.fields.local_primary_key',
        servers: 'tooltips.authn.ldap.fields.servers',
        level: 'tooltips.authn.ldap.fields.level',
        default_authn_method: 'tooltips.authn.ldap.fields.default_authn_method',
        use_ssl: 'tooltips.authn.ldap.fields.use_ssl',
        enabled: 'tooltips.authn.ldap.fields.enabled',
        enable: 'tooltips.authn.ldap.fields.enable',
        disable: 'tooltips.authn.ldap.fields.disable',
        status: 'tooltips.authn.ldap.fields.status',
      },
      placeholders: {
        acr: 'tooltips.authn.ldap.placeholders.acr',
        bind_dn: 'tooltips.authn.ldap.placeholders.bind_dn',
        bind_password: 'tooltips.authn.ldap.placeholders.bind_password',
        remote_ldap_server: 'tooltips.authn.ldap.placeholders.remote_ldap_server',
        max_connections: 'tooltips.authn.ldap.placeholders.max_connections',
        base_dns: 'tooltips.authn.ldap.placeholders.base_dns',
        remote_primary_key: 'tooltips.authn.ldap.placeholders.remote_primary_key',
        local_primary_key: 'tooltips.authn.ldap.placeholders.local_primary_key',
        level: 'tooltips.authn.ldap.placeholders.level',
        default_authn_method: 'tooltips.authn.ldap.placeholders.default_authn_method',
        action_commit_message: 'tooltips.authn.ldap.placeholders.action_commit_message',
      },
      errors: {
        acr_required: 'tooltips.authn.ldap.errors.acr_required',
        bind_dn_required: 'tooltips.authn.ldap.errors.bind_dn_required',
        bind_password_required: 'tooltips.authn.ldap.errors.bind_password_required',
        remote_ldap_server_required: 'tooltips.authn.ldap.errors.remote_ldap_server_required',
        remote_ldap_server_invalid: 'tooltips.authn.ldap.errors.remote_ldap_server_invalid',
        max_connections_required: 'tooltips.authn.ldap.errors.max_connections_required',
        max_connections_type: 'tooltips.authn.ldap.errors.max_connections_type',
        max_connections_positive: 'tooltips.authn.ldap.errors.max_connections_positive',
        max_connections_integer: 'tooltips.authn.ldap.errors.max_connections_integer',
        base_dns_required: 'tooltips.authn.ldap.errors.base_dns_required',
        remote_primary_key_required: 'tooltips.authn.ldap.errors.remote_primary_key_required',
        local_primary_key_required: 'tooltips.authn.ldap.errors.local_primary_key_required',
        level_required: 'tooltips.authn.ldap.errors.level_required',
        level_type: 'tooltips.authn.ldap.errors.level_type',
        level_min: 'tooltips.authn.ldap.errors.level_min',
        level_integer: 'tooltips.authn.ldap.errors.level_integer',
        default_authn_method_required: 'tooltips.authn.ldap.errors.default_authn_method_required',
      },
    },
  },
}
