import type { CSSProperties } from 'react'
import type { WebhookEntry, AuiFeature } from 'JansConfigApi'

export type { WebhookEntry, AuiFeature }

export type MutationCallbacks = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

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

interface ShortcodeField {
  key: string
  label: string
  description?: string
}

export interface ShortcodePopoverProps {
  codes: ShortcodeField[]
  buttonWrapperStyles?: CSSProperties
  buttonWrapperClassName?: string
  handleSelectShortcode: (code: string) => void
  disabled?: boolean
}

export interface ShortcodeLabelProps {
  doc_category?: string
  doc_entry: string
  label: string
  classes: Record<string, string>
}

export interface CursorPosition {
  url: number
  httpRequestBody: number
}

export interface PagedWebhookResult {
  entries?: WebhookEntry[]
  totalEntriesCount?: number
  entriesCount?: number
}

export interface ShortCodesConfig {
  [featureId: string]: {
    fields: ShortcodeField[]
  }
}
