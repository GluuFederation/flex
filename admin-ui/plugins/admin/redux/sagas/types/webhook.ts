import type { WebhookEntry } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type { WebhookEntry }

export type { WebhookTriggerResponseItem } from '../../types/webhook'

export interface TriggerWebhookSagaPayload {
  createdFeatureValue: Record<string, JsonValue>
  feature?: string
}
