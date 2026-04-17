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
  selectedClientScopes: ScopeItem[]
}

export type MessageState = {
  messages: JsonValue[]
  loading: boolean
  error: string | null
}

export type AuthServerPluginState = {
  oidcReducer: OidcState
  scopeReducer: ScopeState
  messageReducer: MessageState
}
