import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type AdditionalActionDataValue = JsonValue | object | undefined

export type AdditionalActionData = {
  modifiedFields?: JsonValue
  performedOn?: JsonValue
  [key: string]: AdditionalActionDataValue
}

export type AdditionalPayload = {
  action?: {
    action_message?: string
    action_data?: AdditionalActionData
  }
  action_message?: string
  message?: string
  modifiedFields?: JsonValue
  performedOn?: JsonValue
  tableData?: JsonValue
  omitPayload?: boolean
  [key: string]:
    | JsonValue
    | { action_message?: string; action_data?: AdditionalActionData }
    | undefined
}

export type AxiosErrorLike = {
  response?: {
    status?: number
  }
}

export type DirectStatusError = {
  status?: number
}

export type HttpError = AxiosErrorLike | DirectStatusError | null | undefined
