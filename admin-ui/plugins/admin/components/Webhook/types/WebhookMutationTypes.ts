export type WebhookApiError = {
  response?: { data?: { responseMessage?: string } }
}

export type WebhookMutationError = Error | WebhookApiError
