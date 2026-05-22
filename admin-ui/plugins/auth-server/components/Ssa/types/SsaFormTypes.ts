import type { SsaData } from './SsaApiTypes'

type ModifiedFieldValue = string | string[] | boolean

export type ModifiedFields = Record<string, ModifiedFieldValue>

export type SsaAuditLogPayload = {
  jti?: string
  org_id?: string
  software_id?: string
}

export type SsaTableRowData = SsaData & {
  id: string
}
