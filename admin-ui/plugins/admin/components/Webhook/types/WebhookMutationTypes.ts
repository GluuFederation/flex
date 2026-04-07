import type { ApiError } from '../../../types'

export type WebhookApiError = ApiError<{ responseMessage?: string }>
export type WebhookMutationError = Error | WebhookApiError
