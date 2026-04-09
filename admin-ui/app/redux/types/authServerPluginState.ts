import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type OidcClientItem = {
  inum?: string
  clientName?: string
  displayName?: string
  [key: string]: JsonValue | undefined
}

export type OidcState = {
  item: OidcClientItem
  view: boolean
}

export type ScopeItem = {
  inum?: string
  id?: string
  displayName?: string
  description?: string
  scopeType?: string
  [key: string]: JsonValue | undefined
}

export type ScopeState = {
  items: ScopeItem[]
  item: ScopeItem
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  scopesByCreator: ScopeItem[]
  totalItems: number
  entriesCount: number
  clientScopes: ScopeItem[]
  loadingClientScopes: boolean
  selectedClientScopes: ScopeItem[]
}

export type UmaResourceItem = {
  inum?: string
  name?: string
  [key: string]: JsonValue | undefined
}

export type UmaResourceState = {
  items: UmaResourceItem[]
  loading: boolean
}

export type MessageState = {
  messages: JsonValue[]
  loading: boolean
  error: string | null
}

export type AuthServerPluginState = {
  oidcReducer: OidcState
  scopeReducer: ScopeState
  umaResourceReducer: UmaResourceState
  messageReducer: MessageState
}
