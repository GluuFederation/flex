import * as Yup from 'yup'
import { type AuthNItem } from '../atoms'

export const getAuthNValidationSchema = (item: AuthNItem | null): Yup.ObjectSchema<any> => {
  const isBuiltIn = item?.name === 'simple_password_auth'
  const isLdap = item?.name === 'default_ldap_password'
  const isScript = item?.name === 'myAuthnScript'

  const baseSchema: Record<string, any> = {
    acr: Yup.string().required('ACR name is required.'),
    level: Yup.number()
      .typeError('Level must be a number.')
      .required('Level is required.')
      .integer('Level must be an integer.')
      .min(-1, 'Level must be at least -1.'),
    defaultAuthNMethod: Yup.mixed<boolean | string>().required('Default AuthN Method is required.'),
  }

  // Built-in specific validations
  if (isBuiltIn) {
    baseSchema.samlACR = Yup.string().optional()
    baseSchema.description = Yup.string().optional()
    baseSchema.primaryKey = Yup.string().optional()
    baseSchema.passwordAttribute = Yup.string().optional()
    baseSchema.hashAlgorithm = Yup.string().optional()
  }

  // Script specific validations
  if (isScript) {
    baseSchema.samlACR = Yup.string().optional()
    baseSchema.description = Yup.string().optional()
    baseSchema.level = Yup.number()
      .typeError('Level must be a number.')
      .required('Level is required.')
      .integer('Level must be an integer.')
      .min(0, 'Level must be at least 0.')
  }

  // LDAP specific validations
  if (isLdap) {
    baseSchema.bindDN = Yup.string().required('Bind DN is required.')
    baseSchema.maxConnections = Yup.number()
      .typeError('Max connections must be a number.')
      .required('Max connections is required.')
      .integer('Max connections must be an integer.')
      .min(1, 'Max connections must be at least 1.')
    baseSchema.remotePrimaryKey = Yup.string().optional()
    baseSchema.localPrimaryKey = Yup.string().optional()
    baseSchema.servers = Yup.array()
      .of(Yup.string().required('Server URL is required.'))
      .min(1, 'At least one server is required.')
      .required('Servers are required.')
    baseSchema.baseDNs = Yup.array()
      .of(Yup.string().required('Base DN is required.'))
      .min(1, 'At least one base DN is required.')
      .required('Base DNs are required.')
    baseSchema.bindPassword = Yup.string().optional()
    baseSchema.useSSL = Yup.boolean().optional()
    baseSchema.enabled = Yup.boolean().optional()
    baseSchema.level = Yup.number()
      .typeError('Level must be a number.')
      .required('Level is required.')
      .integer('Level must be an integer.')
      .min(0, 'Level must be at least 0.')
  }

  return Yup.object(baseSchema)
}
