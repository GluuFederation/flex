export interface WebhookResponseObject {
  webhookId?: string
  webhookName?: string
  inum?: string
}

export interface WebhookTriggerResponseItem {
  success: boolean
  responseMessage: string
  responseObject: WebhookResponseObject
}

export interface WebhookTriggerResponse {
  body: WebhookTriggerResponseItem[]
}
