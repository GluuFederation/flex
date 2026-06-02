import type { Dayjs } from 'dayjs'
import type { JsonObject } from 'Routes/Apps/Gluu/types/common'

type SsaDetails = {
  [key: string]: string | string[] | boolean
  software_id: string
  software_roles: string[]
  description: string
  org_id: string
  grant_types: string[]
  one_time_use: boolean
  rotate_ssa: boolean
  jti: string
}

export type SsaData = {
  ssa: SsaDetails
  status: string
  expiration: number
  name?: string
}

export type SsaJwtResponse = JsonObject & {
  ssa: string
}

export type ExpirationDate = Dayjs | null

export type SsaFormValues = {
  [key: string]: string | number | boolean | string[] | Dayjs | null | undefined
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

export type SsaCreatePayload = SsaFormValues & {
  expiration?: number
}
