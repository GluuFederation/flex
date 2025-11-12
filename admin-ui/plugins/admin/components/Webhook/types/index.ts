import type { CSSProperties, ReactNode, MouseEvent } from 'react'

import type {
  WebhookEntry,
  WebhookEntryHttpRequestBody,
  KeyValuePair,
  AuiFeature,
  GetAllWebhooksParams,
  PagedResult,
} from 'JansConfigApi'

export type {
  WebhookEntry,
  WebhookEntryHttpRequestBody,
  KeyValuePair,
  AuiFeature,
  GetAllWebhooksParams,
  PagedResult,
}

export interface WebhookFormValues {
  httpRequestBody?: string
  httpMethod: string
  url: string
  displayName: string
  httpHeaders: Array<{ key?: string; value?: string }>
  jansEnabled: boolean
  description?: string
  auiFeatureIds: string[]
}

export interface CursorPosition {
  url: number
  httpRequestBody: number
}

export interface ShortcodeField {
  key: string
  label: string
  description?: string
}

export interface FeatureShortcodes {
  [featureId: string]: {
    fields: ShortcodeField[]
  }
}

export interface ShortcodePopoverProps {
  codes?: ShortcodeField[]
  buttonWrapperStyles?: CSSProperties
  handleSelectShortcode: (code: string, name: string, withString?: boolean) => void
}

export interface WebhookFormProps {
  item?: WebhookEntry
  features: AuiFeature[]
  loadingFeatures: boolean
  onSubmit: (values: WebhookFormValues, userMessage: string) => void
  isEdit?: boolean
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE'

export interface TableAction {
  icon: string | (() => string | ReactNode)
  tooltip: string
  onClick: (event: MouseEvent, rowData: WebhookEntry | WebhookEntry[]) => void
  disabled?: boolean
  isFreeAction?: boolean
  iconProps?: {
    color?: string
    style?: CSSProperties
    id?: string
  }
}

export interface WebhookTableColumn {
  title: string
  field?: string
  width?: string
  render?: (rowData: WebhookEntry) => ReactNode
  headerStyle?: CSSProperties
  cellStyle?: CSSProperties
}
