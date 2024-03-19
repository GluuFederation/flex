import * as Yup from 'yup'

export const getInitalValues = (values) => {
  const {
    bindDN = '',
    configId = '',
    bindPassword,
    maxConnections = 0,
    baseDNs = [],
    servers = [],
    useAnonymousBind = false,
    useSSL = false,
    enabled = false,
    localPrimaryKey = '',
    primaryKey = '',
  } = values

  return {
    bindDN,
    configId,
    bindPassword,
    maxConnections,
    baseDNs,
    servers,
    useAnonymousBind,
    useSSL,
    enabled,
    localPrimaryKey,
    primaryKey,
  }
}

export const getValidationSchema = (t) => {
  return Yup.object({
    configId: Yup.string()
      .min(2, 'Mininum 2 characters')
      .required(`${t('fields.name')} ${t('messages.is_required')}`),
    bindDN: Yup.string()
      .min(2, 'Mininum 2 characters')
      .required(`${t('fields.bind_dn')} ${t('messages.is_required')}`),
    maxConnections: Yup.string().required(
      `${t('fields.max_connections')} ${t('messages.is_required')}`
    ),
    bindPassword: Yup.string().required(
      `${t('fields.bind_password')} ${t('messages.is_required')}`
    ),
    servers: Yup.array().min(
      1,
      `${t('fields.server_port')} ${t('messages.is_required')}`
    ),
    baseDNs: Yup.array().min(
      1,
      `${t('fields.base_dns')} ${t('messages.is_required')}`
    ),
  })
}