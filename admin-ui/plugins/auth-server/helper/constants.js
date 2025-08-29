// LDAP constants
export const LDAP_READ = 'LDAP_READ'
export const LDAP_WRITE = 'LDAP_WRITE'
export const LDAP_DELETE = 'LDAP_DELETE'

export const ACTIONS = {
  EDIT_LDAP: 'authNLdap/editLdap',
  ADD_LDAP: 'authNLdap/addLdap',
}

export const FEATURES = {
  LDAP_EDIT: 'ldap_edit',
}

// ...existing STRINGS object...

export const STRINGS = {
  authn: {
    ldap: {
      fields: {
        acr: 'fields.acr', // key for translation
        bind_dn: 'Bind DN',
        bind_password: 'Bind Password',
        remote_ldap_server: 'Remote LDAP Server',
        max_connections: 'Max Connections',
        base_dns: 'Base DNs',
        remote_primary_key: 'Remote Primary Key',
        local_primary_key: 'Local Primary Key',
        primary_key: 'Local Primary Key',
        servers: 'Servers',
        level: 'Level',
        default_authn_method: 'Default Authn Method',
      },
      placeholders: {
        acr: 'Enter Acr',
        bind_dn: 'Enter Bind DN',
        bind_password: 'Enter Bind Password',
        remote_ldap_server: 'Enter Remote LDAP Server',
        max_connections: 'Enter Max Connections',
        base_dns: 'Enter Base DNs',
        remote_primary_key: 'Enter Remote Primary Key',
        local_primary_key: 'Enter Local Primary Key',
        level: 'Enter Level',
        default_authn_method: 'Enter Default Authn Method',
        action_commit_message: 'Enter reason for change',
      },
      errors: {
        acr: 'Acr is required!',
        bind_dn: 'Bind DN is required!',
        bind_password: 'Bind Password is required!',
        remote_ldap_server: 'Remote LDAP Server is required!',
        max_connections: 'Max Connections is required!',
        max_connections_type: 'Max Connections must be a number',
        base_dns: 'Base DNs is required!',
        remote_primary_key: 'Remote Primary Key is required!',
        local_primary_key: 'Local Primary Key is required!',
        level: 'Level is required!',
        level_type: 'Level must be a number',
        default_authn_method: 'Default Authn Method is required!',
      },
    },
  },
}
