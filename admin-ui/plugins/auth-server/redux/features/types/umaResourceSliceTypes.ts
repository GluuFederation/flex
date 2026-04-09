import type { UmaResourceItem } from 'Redux/types'

export type UmaResourceResponseEnvelope<T> = { data?: T | null } | null

export type GetUMAResourcesByClientPayload = { inum: string }
export type GetUMAResourcesByClientResponsePayload = UmaResourceResponseEnvelope<UmaResourceItem[]>
export type DeleteUMAResourcePayload = { action: { id: string } }
export type DeleteUMAResourceResponsePayload = UmaResourceResponseEnvelope<string>
