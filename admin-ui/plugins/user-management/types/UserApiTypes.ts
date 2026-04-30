import {
  CustomObjectAttribute,
  CustomUser as ApiCustomUser,
  JansAttribute,
  CustomObjectAttributeValuesItem,
} from 'JansConfigApi'

export type CustomUser = ApiCustomUser
export type PersonAttribute = JansAttribute

export type CustomAttribute = Omit<CustomObjectAttribute, 'values'> & {
  values?: (string | boolean | CustomObjectAttributeValuesItem)[]
}

export type FidoRegistrationEntry = {
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
    osName?: string
    os_version?: string
    osVersion?: string
  }
  registrationData?: {
    attestationRequest?: string
    domain?: string
    rpId?: string
    type?: string
    status?: string
    createdBy?: string
  }
}

export type AttributeValue = string | boolean

export type UserData = {
  displayName?: string
  givenName?: string
  userId?: string
  mail?: string
  customAttributes?: CustomAttribute[]
}

export type RowProps = {
  row: {
    rowData: UserData
  }
}
