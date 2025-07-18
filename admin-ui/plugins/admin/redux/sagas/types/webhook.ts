export interface Webhook {
  inum: string
  jansEnabled: boolean
  url: string
  httpRequestBody?: any
  [key: string]: any
}

export interface WebhookActionPayload {
  action?: {
    action_data?: any
  }
  [key: string]: any
}

export interface FeatureActionPayload {
  [key: string]: any
}

export interface TriggerWebhookPayload {
  createdFeatureValue: any
  [key: string]: any
}

export interface ApiError {
  response?: {
    body?: {
      responseMessage?: string
    }
  }
  message?: string
}

export interface WebhookResponse {
  body?: any[]
  success?: boolean
  responseObject?: {
    inum: string
  }
}
