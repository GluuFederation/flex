import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { ScopeItem } from 'Redux/types'

export type ScopeResponseEnvelope<T> = { data?: T | null } | null

export type ScopesResponseData = {
  entries?: ScopeItem[]
  totalEntriesCount?: number
  entriesCount?: number
}

export type ScopesResponsePayload = ScopeResponseEnvelope<ScopesResponseData>
export type DeleteScopeResponsePayload = ScopeResponseEnvelope<string>
export type EditOrAddScopeResponsePayload = ScopeResponseEnvelope<ScopeItem>
export type GetScopeByPatternResponsePayload = ScopeResponseEnvelope<ScopeItem>
export type GetScopeByCreatorResponsePayload = ScopeItem[] | { data?: ScopeItem[] } | null
export type GetClientScopesResponsePayload = { data?: { entries?: ScopeItem[] } | null } | null

export type SetCurrentScopePayload = { item: ScopeItem }
export type ScopeActionPayload = { action?: Record<string, JsonValue> }
