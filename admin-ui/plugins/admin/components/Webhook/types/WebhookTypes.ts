import type { CSSProperties, ReactNode } from 'react'
import type { FormikProps } from 'formik'
import type { WebhookEntry, AuiFeature, GetAllWebhooksParams, KeyValuePair } from 'JansConfigApi'

export type { WebhookEntry, AuiFeature, GetAllWebhooksParams, KeyValuePair }

export interface WebhookFormValues {
  displayName: string
  url: string
  httpMethod: string
  description: string
  httpHeaders: HttpHeader[]
  httpRequestBody: string
  jansEnabled: boolean
}

export interface HttpHeader {
  key?: string
  value?: string
  source?: string
  destination?: string
}

export interface WebhookFormProps {
  webhook?: WebhookEntry | null
  webhookFeatures?: AuiFeature[]
  isEdit?: boolean
}

export interface ShortcodeField {
  key: string
  label: string
  description?: string
}

export interface ShortcodePopoverProps {
  codes: ShortcodeField[]
  buttonWrapperStyles?: CSSProperties
  handleSelectShortcode: (code: string) => void
}

export interface ShortcodeLabelProps {
  doc_category?: string
  doc_entry: string
  label: string
}

export interface WebhookListState {
  pageNumber: number
  limit: number
  pattern: string
}

export interface DeleteModalState {
  isOpen: boolean
  webhook: WebhookEntry | null
}

export interface CursorPosition {
  url: number
  httpRequestBody: number
}

export interface WebhookSliceState {
  webhooks: WebhookEntry[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedWebhook: WebhookEntry | null
  loadingFeatures: boolean
  features: AuiFeature[]
  webhookFeatures: AuiFeature[]
  loadingWebhookFeatures: boolean
  loadingWebhooks: boolean
  featureWebhooks: WebhookEntry[]
  webhookModal: boolean
  triggerWebhookInProgress: boolean
  triggerWebhookMessage: string
  webhookTriggerErrors: unknown[]
  triggerPayload: TriggerPayload
  featureToTrigger: string
  showErrorModal: boolean
}

export interface TriggerPayload {
  feature: string | null
  payload: unknown
}

export interface WebhookActionPayload {
  action?: {
    action_message?: string
    action_data?: WebhookEntry | { inum: string }
    limit?: number
    pattern?: string
    startIndex?: number
  }
}

export interface PagedWebhookResult {
  entries?: WebhookEntry[]
  totalEntriesCount?: number
  entriesCount?: number
}

export interface TableAction {
  icon: string | (() => ReactNode)
  tooltip: string
  iconProps?: Record<string, unknown>
  isFreeAction?: boolean
  onClick: (event: React.MouseEvent, rowData?: WebhookEntry | WebhookEntry[]) => void
  disabled?: boolean
}

export type WebhookFormikInstance = FormikProps<WebhookFormValues>

export interface SearchEvent {
  target: {
    name: string
    value: string | number
  }
  keyCode?: number
}

export interface ShortCodesConfig {
  [featureId: string]: {
    fields: ShortcodeField[]
  }
}
