import type { WebhookEntry } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { WebhookOutputItem } from 'Plugins/admin/helper/utils'

export type { WebhookEntry, WebhookOutputItem }

export type { WebhookTriggerResponseItem } from '../../types/webhook'
export type {
  WebhooksByFeatureIdApiResponse,
  TriggerWebhookApiResponse,
  TriggerWebhookApiPayload,
} from '../../api/WebhookApi'

export interface TriggerWebhookSagaPayload {
  createdFeatureValue: Record<string, JsonValue>
}

export interface SagaApiError {
  response?: {
    status?: number
    body?: {
      responseMessage?: string
    }
  }
  message?: string
}
