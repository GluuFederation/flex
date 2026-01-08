import type { Dayjs } from 'dayjs'

export interface SsaDetails extends Record<string, unknown> {
  software_id: string
  software_roles: string[]
  description: string
  org_id: string
  grant_types: string[]
  one_time_use: boolean
  rotate_ssa: boolean
  jti: string
}

export interface SsaData {
  ssa: SsaDetails
  status: string
  expiration: number
}

export interface SsaJwtResponse {
  ssa: string
}

export type ExpirationDate = Dayjs | null

export interface SsaFormValues extends Record<string, unknown> {
  software_id: string
  one_time_use: boolean
  org_id: string
  description: string
  software_roles: string[]
  rotate_ssa: boolean
  grant_types: string[]
  is_expirable: boolean
  expirationDate: ExpirationDate
}

export interface SsaCreatePayload extends SsaFormValues {
  expiration?: number
}

export interface CustomAttributesListProps {
  availableAttributes: string[]
  selectedAttributes: string[]
  onAttributeSelect: (attribute: string) => void
  searchQuery: string
  searchInputValue: string
  onSearchChange: (value: string) => void
}

export interface SsaDetailPageProps {
  row: SsaData
}

type ModifiedFieldValue = string | string[] | boolean

export type ModifiedFields = Record<string, ModifiedFieldValue>

export interface SsaAuditLogPayload {
  jti?: string
  org_id?: string
  software_id?: string
  [key: string]: unknown
}
