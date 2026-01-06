import { atom } from 'jotai'

export interface ConfigurationProperty {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

export interface AuthNItem {
  inum?: string
  name?: string
  acrName?: string
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
  tableData?: unknown
}

export const currentAuthNItemAtom = atom<AuthNItem | null>(null)
