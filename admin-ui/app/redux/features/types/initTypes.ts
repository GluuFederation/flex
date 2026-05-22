import type { GenericItem } from 'Redux/types'

export type InitState = {
  scripts: GenericItem[]
  isTimeout: boolean
}

export type ActionDataPayload = {
  [key: string]: string | number | boolean | string[] | number[] | boolean[] | null
}

export type ScriptsResponsePayload = {
  data?: {
    entries?: GenericItem[]
  }
}

export type ApiTimeoutPayload = {
  isTimeout: boolean
}
