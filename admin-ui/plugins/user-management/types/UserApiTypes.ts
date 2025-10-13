import { AuthState } from '../helper/userAuditHelpers'

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
  customAttributes?: CustomAttribute[]
  customObjectClasses?: string[]
  dn?: string
  createdAt?: string
  updatedAt?: string
  baseDn?: string
  [key: string]: string | string[] | number | boolean | CustomAttribute[] | undefined // Allow additional properties with proper types
}

// Custom attribute interface
export interface CustomAttribute {
  name: string
  multiValued?: boolean
  values?: string[] | []
  value?: string
  displayValue?: string
}

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
    os_version?: string
  }
  registrationData?: {
    attenstationRequest?: string
    domain?: string
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
  customAttributes?: CustomAttribute[]
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
