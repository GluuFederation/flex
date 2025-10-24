// LDAP validation schema using Yup
import * as Yup from 'yup'
import { STRINGS } from './constants'

export function getLdapValidationSchema(t) {
  const e = STRINGS.authn.ldap.errors
  return Yup.object().shape({
    configId: Yup.string().min(1, t(e.acr_required)).required(t(e.acr_required)),
    bindDN: Yup.string().min(1, t(e.bind_dn_required)).required(t(e.bind_dn_required)),
    bindPassword: Yup.string()
      .min(1, t(e.bind_password_required))
      .required(t(e.bind_password_required)),
    servers: Yup.array()
      .of(
        Yup.string()
          .min(1, t(e.remote_ldap_server_required))
          .matches(/^(http|https):\/\/[^\s]+$/, t(e.remote_ldap_server_invalid))
          .required(t(e.remote_ldap_server_required)),
      )
      .min(1, t(e.remote_ldap_server_required))
      .required(t(e.remote_ldap_server_required)),
    baseDNs: Yup.array()
      .of(Yup.string().min(1, t(e.base_dns_required)).required(t(e.base_dns_required)))
      .min(1, t(e.base_dns_required))
      .required(t(e.base_dns_required)),
    maxConnections: Yup.number()
      .typeError(t(e.max_connections_type))
      .positive(t(e.max_connections_positive))
      .integer(t(e.max_connections_integer))
      .required(t(e.max_connections_required)),
    primaryKey: Yup.string()
      .min(1, t(e.remote_primary_key_required))
      .required(t(e.remote_primary_key_required)),
    localPrimaryKey: Yup.string()
      .min(1, t(e.local_primary_key_required))
      .required(t(e.local_primary_key_required)),
    level: Yup.number()
      .typeError(t(e.level_type))
      .min(1, t(e.level_min))
      .integer(t(e.level_integer))
      .required(t(e.level_required)),
    defaultAuthnMethod: Yup.boolean(),
  })
}
