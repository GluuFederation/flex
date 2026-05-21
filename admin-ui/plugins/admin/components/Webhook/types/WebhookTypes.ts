import type { CSSProperties } from 'react'
import type { WebhookEntry, AuiFeature } from 'JansConfigApi'

export type { WebhookEntry, AuiFeature }

export type MutationCallbacks = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export type WebhookFormValues = {
  displayName: string
  url: string
  httpMethod: string
  description: string
  httpHeaders: HttpHeader[]
  httpRequestBody: string
  jansEnabled: boolean
}

export type HttpHeader = {
  key?: string
  value?: string
  source?: string
  destination?: string
}

type ShortcodeField = {
  key: string
  label: string
  description?: string
}

export type ShortcodePopoverProps = {
  codes: ShortcodeField[]
  buttonWrapperStyles?: CSSProperties
  buttonWrapperClassName?: string
  handleSelectShortcode: (code: string) => void
  disabled?: boolean
}

export type ShortcodeLabelProps = {
  doc_category?: string
  doc_entry: string
  label: string
  classes: Record<string, string>
}

export type CursorPosition = {
  url: number
  httpRequestBody: number
}

export type PagedWebhookResult = {
  entries?: WebhookEntry[]
  totalEntriesCount?: number
  entriesCount?: number
}

export type ShortCodesConfig = {
  [featureId: string]: {
    fields: ShortcodeField[]
  }
}
