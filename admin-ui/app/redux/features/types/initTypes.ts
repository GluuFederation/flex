import type { GenericItem } from 'Redux/types'

export type InitState = {
  scripts: GenericItem[]
  clients: GenericItem[]
  scopes: GenericItem[]
  attributes: GenericItem[]
  totalClientsEntries: number
  isTimeout: boolean
  loadingScripts: boolean
}

export type ActionDataPayload = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null
}

export type ScriptsResponsePayload = {
  data?: {
    entries?: GenericItem[]
  }
}

export type ClientsResponsePayload = {
  data?: {
    entries?: GenericItem[]
    totalEntriesCount?: number
  }
}

export type ScopesResponsePayload = {
  data?: GenericItem[]
}

export type AttributesResponsePayload = {
  data?: {
    entries?: GenericItem[]
  }
}

export type ApiTimeoutPayload = {
  isTimeout: boolean
}
