import type { ApiError } from '@/utils/types'

export type WebhookApiError = ApiError<{ responseMessage?: string }>
export type WebhookMutationError = Error | WebhookApiError
