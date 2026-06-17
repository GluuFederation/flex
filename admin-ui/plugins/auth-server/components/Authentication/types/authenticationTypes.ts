export type ConfigurationProperty = {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

export type PropertyConfig = {
  id: string
  key: string
  value: string
}

export type AuthNItem = {
  inum?: string
  name?: string
  acrName?: string
  isCustomScript?: boolean
  scriptType?: string
  defaultAuthNMethod?: boolean | string
  level?: number
  samlACR?: string
  description?: string
  primaryKey?: string
  passwordAttribute?: string
  hashAlgorithm?: string
  bindDN?: string
  maxConnections?: number
  localPrimaryKey?: string
  servers?: string[]
  baseDNs?: string[]
  bindPassword?: string
  useSSL?: boolean
  enabled?: boolean
  configId?: string
  baseDn?: string
  dn?: string
  configurationProperties?: ConfigurationProperty[]
}

export type BuiltInAcr = {
  name: string
  level: number
  description: string
  samlACR: string
  primaryKey: string
  passwordAttribute: string
  hashAlgorithm: string
  defaultAuthNMethod: boolean
  acrName: string
}

export type TabName = {
  id: string
  name: string
  path: string
}

export type AcrsProps = {
  isBuiltIn?: boolean
}

export type DefaultAcrFormValues = {
  defaultAcr: string
}

export type AliasesProps = {
  onRegisterAddHandler?: (fn: () => void) => void
  onWritePermissionChange?: (canWrite: boolean) => void
}

export type AcrsFormValues = {
  acr: string
  level: number
  defaultAuthNMethod: boolean | string
  samlACR: string
  description: string
  primaryKey: string
  passwordAttribute: string
  hashAlgorithm: string
  bindDN: string
  maxConnections: string | number
  remotePrimaryKey: string
  localPrimaryKey: string
  servers: string[]
  baseDNs: string[]
  bindPassword: string
  useSSL: boolean
  enabled: boolean
  configId: string
  baseDn: string | undefined
  inum: string | undefined
  configurationProperties?: PropertyConfig[]
}

export type AcrsFormProps = {
  item: AuthNItem
  handleSubmit: (values: AcrsFormValues) => void
  isSubmitting?: boolean
}
