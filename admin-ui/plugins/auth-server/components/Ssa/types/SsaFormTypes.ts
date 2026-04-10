import type { SsaData } from './SsaApiTypes'

type ModifiedFieldValue = string | string[] | boolean

export type ModifiedFields = Record<string, ModifiedFieldValue>

export interface SsaAuditLogPayload {
  jti?: string
  org_id?: string
  software_id?: string
}

export interface SsaTableRowData extends SsaData {
  id: string
}
