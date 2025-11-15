import { AuthState } from '../helper/userAuditHelpers'
import { CustomObjectAttribute, CustomUser as ApiCustomUser, JansAttribute } from 'JansConfigApi'

// Use the generated API types as the primary reference
export type CustomUser = ApiCustomUser
export type PersonAttribute = JansAttribute

// Custom attribute interface - now using CustomObjectAttribute from SDK
export type CustomAttribute = CustomObjectAttribute

// 2FA Registration entry
export interface FidoRegistrationEntry {
  id?: string
  challenge?: string
  username?: string
  displayName?: string
  domain?: string
  userId?: string
  creationDate?: string
  counter?: number
  status?: string
  deviceData?: {
    platform?: string
    name?: string
    os_name?: string
    osName?: string // Alternative property name for os_name
    os_version?: string
    osVersion?: string // Alternative property name for os_version
  }
  registrationData?: {
    attenstationRequest?: string
    domain?: string
    rpId?: string // Alternative property name for domain
    type?: string
    status?: string
    createdBy?: string
  }
}

export interface UserData {
  displayName?: string
  givenName?: string
  userId?: string
  mail?: string
  customAttributes?: CustomObjectAttribute[]
}

export interface RowProps {
  row: {
    rowData: UserData
  }
}
