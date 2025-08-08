// Base attribute validation interface
export interface AttributeValidation {
  minLength?: number | null
  maxLength?: number | null
  regexp?: string | null
}

// Data type enums
export type DataType =
  | 'string'
  | 'numeric'
  | 'boolean'
  | 'binary'
  | 'certificate'
  | 'generalizedTime'
  | 'json'

// Edit type enums
export type EditType = 'admin' | 'owner' | 'manager' | 'user' | 'whitePages'

// View type enums
export type ViewType = 'admin' | 'owner' | 'manager' | 'user' | 'whitePages'

// Usage type enums
export type UsageType = 'openid'

// Status enums
export type StatusType = 'active' | 'inactive' | 'expired' | 'register'

// Base JansAttribute interface
export interface JansAttribute {
  dn?: string
  inum?: string
  sourceAttribute?: string
  nameIdType?: string
  name?: string
  displayName?: string
  description?: string
  origin?: string
  dataType?: DataType
  editType?: EditType[]
  viewType?: ViewType[]
  usageType?: UsageType[]
  claimName?: string
  seeAlso?: string
  status?: StatusType
  saml1Uri?: string
  saml2Uri?: string
  urn?: string
  scimCustomAttr?: boolean
  oxMultiValuedAttribute?: boolean
  jansHideOnDiscovery?: boolean
  required?: boolean
  custom?: boolean
  attributeValidation?: AttributeValidation
  tooltip?: string
  selected?: boolean
  whitePagesCanView?: boolean
  userCanEdit?: boolean
  adminCanView?: boolean
  adminCanEdit?: boolean
  userCanView?: boolean
  adminCanAccess?: boolean
  userCanAccess?: boolean
  baseDn?: string
}

// Paged result for attribute listing
export interface AttributePagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: JansAttribute[]
}

// Patch request for attribute updates
export interface AttributePatchRequest {
  op?: 'add' | 'remove' | 'replace'
  path?: string
  value?: string | string[] | number | boolean | null
}

// Options for getting attributes
export interface GetAttributesOptions {
  limit?: number
  pattern?: string
  status?: string
  startIndex?: number
  sortBy?: string
  sortOrder?: 'ascending' | 'descending'
  fieldValuePair?: string
}

// Options for creating/updating attributes
export interface AttributeModifyOptions {
  jansAttribute?: JansAttribute
}

// Options for patching attributes
export interface AttributePatchOptions {
  patchRequest?: AttributePatchRequest[]
}

// Payload for AttributeApi methods
export interface GetAttributesPayload {
  action: GetAttributesOptions
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

// Configuration Attribute API interface
export interface IConfigurationAttributeApi {
  deleteAttributesByInum(
    inum: string,
    callback: (error: Error | null, data?: unknown, response?: unknown) => void,
  ): unknown
  getAttributes(
    opts: GetAttributesOptions,
    callback: (error: Error | null, data?: AttributePagedResult, response?: unknown) => void,
  ): unknown
  getAttributesByInum(
    inum: string,
    callback: (error: Error | null, data?: JansAttribute, response?: unknown) => void,
  ): unknown
  patchAttributesByInum(
    inum: string,
    opts: AttributePatchOptions,
    callback: (error: Error | null, data?: JansAttribute, response?: unknown) => void,
  ): unknown
  postAttributes(
    opts: AttributeModifyOptions,
    callback: (error: Error | null, data?: JansAttribute, response?: unknown) => void,
  ): unknown
  putAttributes(
    opts: AttributeModifyOptions,
    callback: (error: Error | null, data?: JansAttribute, response?: unknown) => void,
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
  attributesReducer?: {
    items: JansAttribute[]
    loading: boolean
  }
}

// Define the state interface
export interface AttributeState {
  items: JansAttribute[]
  selectedAttributeData: JansAttribute | null
  loading: boolean
  redirectToAttributeListPage: boolean
  totalItems: number
  entriesCount: number
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
