import { AuthState } from '../helper/userAuditHelpers'
import { CustomObjectAttribute } from 'JansConfigApi'

// Base user object interface
export interface CustomUser {
  inum?: string
  userId?: string
  displayName?: string
  givenName?: string
  familyName?: string
  mail?: string
  jansStatus?: string
  status?: string
  userPassword?: string
  customAttributes?: CustomObjectAttribute[]
  customObjectClasses?: string[]
  dn?: string
  createdAt?: string
  updatedAt?: string
  baseDn?: string
  [key: string]: string | string[] | number | boolean | CustomObjectAttribute[] | undefined // Allow additional properties with proper types
}

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

// Type definitions for Redux state
export interface RootState {
  authReducer: AuthState
  apiRoleReducer: {
    items: Array<{ role: string; inum?: string }>
    loading: boolean
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

export interface UserDetailState {
  attributesReducerRoot: {
    items: Array<{
      name: string
      displayName: string
      description: string
    }>
  }
}

// Define interfaces for TypeScript typing
export interface PersonAttribute {
  name: string
  displayName?: string
  description?: string
  status?: string
  dataType?: string
  editType?: string[]
  viewType?: string[]
  usageType?: string[]
  jansHideOnDiscovery?: boolean
  oxMultiValuedAttribute?: boolean
  attributeValidation?: {
    maxLength?: number | null
    regexp?: string | null
    minLength?: number | null
  }
  scimCustomAttr?: boolean
  inum?: string
  options?: string[] // Added for dynamic options used in forms
}

interface AttributesState {
  items: PersonAttribute[]
  loading: boolean
  initLoading: boolean
}

export interface UserManagementRootState {
  userReducer: UserState
  attributesReducerRoot: AttributesState
}

// Define the state interface
export interface UserState {
  items: CustomUser[]
  selectedUserData: CustomUser | null
  loading: boolean
  redirectToUserListPage: boolean
  totalItems: number
  entriesCount: number
  fidoDetails: FidoRegistrationEntry[] | Record<string, never>
  isUserLogout: boolean
}
