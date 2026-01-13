import { BasicQueryStringUtils } from '@openid/appauth'

type GenericRecord = Record<string, unknown>

type AdditionalActionData = GenericRecord & {
  modifiedFields?: unknown
  performedOn?: unknown
}

export type AdditionalPayload = GenericRecord & {
  action?: {
    action_message?: string
    action_data?: AdditionalActionData
  }
  action_message?: string
  message?: string
  modifiedFields?: unknown
  performedOn?: unknown
  tableData?: unknown
  omitPayload?: boolean
}

export const isFourZeroOneError = (error?: any): boolean => {
  return error?.response?.status === 401 || error?.status === 401
}

export const saveState = (state?: string | null): void => {
  if (state) {
    localStorage.setItem('gluu.flow.state', state)
  }
}

export const saveIssuer = (issuer: string): void => {
  localStorage.setItem('issuer', issuer)
}

export const getIssuer = (): string | null => {
  return localStorage.getItem('issuer')
}

export const isValidState = (newState?: string | null): boolean => {
  return localStorage.getItem('gluu.flow.state') === newState
}

export const addAdditionalData = (
  audit: GenericRecord,
  action: string,
  resource: string,
  payload: AdditionalPayload = {},
): void => {
  const sanitizedPayload: AdditionalPayload = { ...payload }

  if (payload.action) {
    sanitizedPayload.action = { ...payload.action }
    if (payload.action.action_data) {
      sanitizedPayload.action.action_data = { ...payload.action.action_data }
    }
  }

  const shouldOmitPayload = Boolean(sanitizedPayload.omitPayload)
  if ('omitPayload' in sanitizedPayload) {
    delete sanitizedPayload.omitPayload
  }

  audit.action = action
  audit.resource = resource

  const message =
    sanitizedPayload.action?.action_message ??
    sanitizedPayload.action_message ??
    sanitizedPayload.message
  if (message !== undefined) {
    audit.message = message
  }

  const actionData = sanitizedPayload.action?.action_data

  if (actionData?.modifiedFields !== undefined || sanitizedPayload.modifiedFields !== undefined) {
    audit.modifiedFields =
      actionData?.modifiedFields !== undefined
        ? actionData.modifiedFields
        : sanitizedPayload.modifiedFields
  }

  if (actionData?.performedOn !== undefined || sanitizedPayload.performedOn !== undefined) {
    audit.performedOn =
      actionData?.performedOn !== undefined ? actionData.performedOn : sanitizedPayload.performedOn
  }

  if (actionData) {
    if ('modifiedFields' in actionData) {
      delete actionData.modifiedFields
    }
    if ('performedOn' in actionData) {
      delete actionData.performedOn
    }
  }

  if ('modifiedFields' in sanitizedPayload) {
    delete sanitizedPayload.modifiedFields
  }

  if ('performedOn' in sanitizedPayload) {
    delete sanitizedPayload.performedOn
  }

  if ('action_message' in sanitizedPayload) {
    delete sanitizedPayload.action_message
  }

  if ('tableData' in sanitizedPayload) {
    delete sanitizedPayload.tableData
  }

  if (!shouldOmitPayload) {
    audit.payload = sanitizedPayload.action ? sanitizedPayload.action.action_data : sanitizedPayload
  }

  audit.date = new Date()
}

export class NoHashQueryStringUtils extends BasicQueryStringUtils {
  parse(
    input: Parameters<BasicQueryStringUtils['parse']>[0],
    _useHash?: Parameters<BasicQueryStringUtils['parse']>[1],
  ): ReturnType<BasicQueryStringUtils['parse']> {
    return super.parse(input, false)
  }
}
