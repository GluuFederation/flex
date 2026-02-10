import { CustomObjectAttribute, CustomUser as ApiCustomUser, JansAttribute } from 'JansConfigApi'

export type CustomUser = ApiCustomUser
export type PersonAttribute = JansAttribute
export type CustomAttribute = CustomObjectAttribute

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
