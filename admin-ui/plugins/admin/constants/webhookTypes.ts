export interface WebhookTriggerResponseItem {
  success: boolean
  responseMessage: string
  responseObject: {
    webhookId?: string
    webhookName?: string
    inum?: string
  }
}

export interface WebhookTriggerResponse {
  body: WebhookTriggerResponseItem[]
}
