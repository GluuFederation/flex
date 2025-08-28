// LDAP validation schema using Yup
import * as Yup from 'yup'
import { STRINGS } from './constants'

export function getLdapValidationSchema() {
  const e = STRINGS.authn.ldap.errors
  return Yup.object().shape({
    configId: Yup.string().min(1, e.acr).required(e.acr),
    bindDN: Yup.string().min(1, e.bind_dn).required(e.bind_dn),
    bindPassword: Yup.string().min(1, e.bind_password).required(e.bind_password),
    servers: Yup.array()
      .of(Yup.string().min(1, e.remote_ldap_server).required(e.remote_ldap_server))
      .min(1, e.remote_ldap_server)
      .required(e.remote_ldap_server),
    baseDNs: Yup.array()
      .of(Yup.string().min(1, e.base_dns).required(e.base_dns))
      .min(1, e.base_dns)
      .required(e.base_dns),
    maxConnections: Yup.number().typeError(e.max_connections_type).required(e.max_connections),
    primaryKey: Yup.string().min(1, e.remote_primary_key).required(e.remote_primary_key),
    localPrimaryKey: Yup.string().min(1, e.local_primary_key).required(e.local_primary_key),
    level: Yup.number().typeError(e.level_type).required(e.level),
    defaultAuthnMethod: Yup.boolean(),
  })
}
