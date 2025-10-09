// LDAP utility functions
export function formatLdapServers(servers) {
  if (Array.isArray(servers)) {
    return servers.join(', ')
  }
  return servers
}

export function formatBaseDNs(baseDNs) {
  if (Array.isArray(baseDNs)) {
    return baseDNs.join(', ')
  }
  return baseDNs
}

export const ldapFormInitialState = (isEdit, item) =>
  isEdit && item
    ? item
    : {
        configId: '',
        bindDN: '',
        bindPassword: '',
        servers: [''],
        maxConnections: '',
        baseDNs: [''],
        primaryKey: '',
        localPrimaryKey: '',
        level: '',
        defaultAuthnMethod: false,
        useSSL: false,
        useAnonymousBind: false,
        enabled: false,
        version: '',
      }

export function buildLdapPayload(values, userMessage) {
  const serversArr = Array.isArray(values.servers)
    ? values.servers.map((s) => String(s).trim()).filter(Boolean)
    : values.servers
      ? String(values.servers)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  const baseDNsArr = Array.isArray(values.baseDNs)
    ? values.baseDNs.map((s) => String(s).trim()).filter(Boolean)
    : values.baseDNs
      ? String(values.baseDNs)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  return {
    gluuLdapConfiguration: {
      configId: values.configId,
      bindDN: values.bindDN,
      bindPassword: values.bindPassword,
      servers: serversArr,
      maxConnections: Number(values.maxConnections),
      useSSL: !!values.useSSL,
      baseDNs: baseDNsArr,
      primaryKey: values.primaryKey || values.localPrimaryKey,
      localPrimaryKey: values.localPrimaryKey,
      useAnonymousBind: !!values.useAnonymousBind,
      enabled: !!values.enabled,
      version: values.version !== undefined ? Number(values.version) : 0,
      level: values.level !== undefined ? Number(values.level) : 0,
      defaultAuthnMethod:
        values.defaultAuthnMethod === true ||
        String(values.defaultAuthnMethod).toLowerCase() === 'true',
    },
    action_message: userMessage,
  }
}
