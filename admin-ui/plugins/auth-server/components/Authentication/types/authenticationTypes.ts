export type ConfigurationProperty = {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
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
