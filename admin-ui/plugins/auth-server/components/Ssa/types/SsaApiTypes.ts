import type { Dayjs } from 'dayjs'

export interface SsaDetails {
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

export type SsaFormFieldValue = string | string[] | boolean | number | ExpirationDate | undefined

export interface SsaCreatePayload extends SsaFormValues {
  expiration?: number
}

export interface SsaFormValues {
  software_id: string
  one_time_use: boolean
  org_id: string
  description: string
  software_roles: string[]
  rotate_ssa: boolean
  grant_types: string[]
  is_expirable: boolean
  expirationDate: ExpirationDate
  [key: string]: SsaFormFieldValue
}
