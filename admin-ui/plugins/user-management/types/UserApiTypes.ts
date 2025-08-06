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

// Paged result for user listing
export interface UserPagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: CustomUser[]
}

// Patch request for user updates
export interface UserPatchRequest {
  inum?: string
  op?: 'add' | 'remove' | 'replace'
  path?: string
  value?: string | string[] | number | boolean | null
  patches?: UserPatch[]
}

// Individual patch operation
export interface UserPatch {
  op: 'add' | 'remove' | 'replace'
  path: string
  value?: string | string[] | number | boolean | null
}

// Options for getting users
export interface GetUserOptions {
  limit?: number
  pattern?: string
  startIndex?: number
  sortBy?: string
  sortOrder?: 'ascending' | 'descending'
  fieldValuePair?: string
}

// Options for creating/updating users
export interface UserModifyOptions {
  removeNonLDAPAttributes?: boolean
  customUser?: CustomUser
  action_message?: string
}

// Options for patching users
export interface UserPatchOptions {
  removeNonLDAPAttributes?: boolean
  userPatchRequest?: UserPatchRequest
}

// Payload for UserApi methods
export interface GetUsersPayload {
  action: GetUserOptions
}

// 2FA Details payload
export interface User2FAPayload {
  username: string
  token: string
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

// API Error interface
export interface ApiError {
  code?: string
  message?: string
  description?: string
}

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T
  error?: ApiError
  status?: number
}

// Configuration User Management API interface
export interface IConfigurationUserManagementApi {
  deleteUser(
    inum: string,
    callback: (error: Error | null, data?: unknown, response?: unknown) => void,
  ): unknown
  getUser(
    opts: GetUserOptions,
    callback: (error: Error | null, data?: UserPagedResult, response?: unknown) => void,
  ): unknown
  getUserByInum(
    inum: string,
    callback: (error: Error | null, data?: CustomUser, response?: unknown) => void,
  ): unknown
  patchUserByInum(
    inum: string,
    opts: UserPatchOptions,
    callback: (error: Error | null, data?: CustomUser, response?: unknown) => void,
  ): unknown
  postUser(
    opts: UserModifyOptions,
    callback: (error: Error | null, data?: CustomUser, response?: unknown) => void,
  ): unknown
  putUser(
    opts: UserModifyOptions,
    callback: (error: Error | null, data?: CustomUser, response?: unknown) => void,
  ): unknown
}

// Type definitions for Redux state
export interface AuthState {
  token: {
    access_token: string
  }
  issuer: string
  userinfo_jwt: string
}

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

// Action payload interfaces
export interface SetUser2FADetailsPayload {
  data?: FidoRegistrationEntry[]
}

export interface ChangeUserPasswordPayload {
  inum: string
  userPassword?: string
  action_message?: string
  jsonPatchString?: string
  customAttributes?: CustomAttribute[]
  performedOn?: {
    user_inum: string
    userId: string | undefined
  }
}

export interface AuditLogoutLogsPayload {
  username: string
}

// Define proper error type for saga error handling
export interface SagaError {
  response?: {
    body?: {
      description?: string
      message?: string
    }
    text?: string
  }
  message?: string
}
