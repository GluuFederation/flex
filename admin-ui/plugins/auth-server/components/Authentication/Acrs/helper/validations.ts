import * as Yup from 'yup'
import type { AuthNItem } from '../../types'
import { AUTH_METHOD_NAMES } from '../../constants'

export const getAuthNValidationSchema = (item: AuthNItem | null): Yup.AnyObjectSchema => {
  const isBuiltIn = item?.name === AUTH_METHOD_NAMES.SIMPLE_PASSWORD
  const isLdap = item?.name === AUTH_METHOD_NAMES.DEFAULT_LDAP
  const isScript = !!item?.isCustomScript

  const baseSchema: Record<string, Yup.AnySchema> = {
    acr: Yup.string().required('ACR name is required.'),
    level: Yup.number()
      .typeError('Level must be a number.')
      .required('Level is required.')
      .integer('Level must be an integer.')
      .min(-1, 'Level must be at least -1.'),
    defaultAuthNMethod: Yup.mixed<boolean | string>().required('Default AuthN Method is required.'),
  }

  if (isBuiltIn) {
    baseSchema.samlACR = Yup.string().optional().nullable()
    baseSchema.description = Yup.string().optional().nullable()
    baseSchema.primaryKey = Yup.string().optional().nullable()
    baseSchema.passwordAttribute = Yup.string().optional().nullable()
    baseSchema.hashAlgorithm = Yup.string().optional().nullable()
  }

  if (isScript) {
    baseSchema.samlACR = Yup.string().optional().nullable()
    baseSchema.description = Yup.string().optional().nullable()
    baseSchema.level = Yup.number()
      .typeError('Level must be a number.')
      .required('Level is required.')
      .integer('Level must be an integer.')
      .min(0, 'Level must be at least 0.')
  }

  if (isLdap) {
    baseSchema.bindDN = Yup.string().required('Bind DN is required.')
    baseSchema.maxConnections = Yup.number()
      .typeError('Max connections must be a number.')
      .required('Max connections is required.')
      .integer('Max connections must be an integer.')
      .min(1, 'Max connections must be at least 1.')
    baseSchema.remotePrimaryKey = Yup.string().optional().nullable()
    baseSchema.localPrimaryKey = Yup.string().optional().nullable()
    baseSchema.servers = Yup.array()
      .of(Yup.string().required('Server URL is required.'))
      .min(1, 'At least one server is required.')
      .required('Servers are required.')
    baseSchema.baseDNs = Yup.array()
      .of(Yup.string().required('Base DN is required.'))
      .min(1, 'At least one base DN is required.')
      .required('Base DNs are required.')
    baseSchema.bindPassword = Yup.string().optional().nullable()
    baseSchema.useSSL = Yup.boolean().optional().nullable()
    baseSchema.enabled = Yup.boolean().optional().nullable()
    baseSchema.level = Yup.number()
      .typeError('Level must be a number.')
      .required('Level is required.')
      .integer('Level must be an integer.')
      .min(0, 'Level must be at least 0.')
  }

  return Yup.object(baseSchema)
}
