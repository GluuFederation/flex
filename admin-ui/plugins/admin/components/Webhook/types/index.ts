/**
 * Type definitions for Webhook components
 * Re-exports orval-generated types and defines component-specific types
 */

// Import orval types for local use
import type {
  WebhookEntry,
  WebhookEntryHttpRequestBody,
  KeyValuePair,
  AuiFeature,
  GetAllWebhooksParams,
  PagedResult,
} from 'JansConfigApi'

// Re-export orval types for convenience
export type {
  WebhookEntry,
  WebhookEntryHttpRequestBody,
  KeyValuePair,
  AuiFeature,
  GetAllWebhooksParams,
  PagedResult,
}

/**
 * Form values for webhook creation and editing
 */
export interface WebhookFormValues {
  httpRequestBody?: string
  httpMethod: string
  url: string
  displayName: string
  httpHeaders: Array<{ key?: string; value?: string }>
  jansEnabled: boolean
  description?: string
  auiFeatureIds?: string[]
}

/**
 * Cursor position tracking for shortcode insertion
 */
export interface CursorPosition {
  url: number
  httpRequestBody: number
}

/**
 * Shortcode field definition
 */
export interface ShortcodeField {
  key: string
  label: string
  description?: string
}

/**
 * Feature-specific shortcodes mapping
 */
export interface FeatureShortcodes {
  [featureId: string]: {
    fields: ShortcodeField[]
  }
}

/**
 * Props for ShortcodePopover component
 */
export interface ShortcodePopoverProps {
  codes?: ShortcodeField[]
  buttonWrapperStyles?: React.CSSProperties
  handleSelectShortcode: (code: string, name: string, withString?: boolean) => void
}

/**
 * Props for WebhookForm component
 */
export interface WebhookFormProps {
  item?: WebhookEntry
  features: AuiFeature[]
  loadingFeatures: boolean
  onSubmit: (values: WebhookFormValues, userMessage: string) => void
  isEdit?: boolean
}

/**
 * HTTP methods supported by webhooks
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Audit log action types
 */
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE'

/**
 * Material Table action configuration
 */
export interface TableAction {
  icon: string | (() => string | JSX.Element)
  tooltip: string
  onClick: (event: React.MouseEvent, rowData: WebhookEntry | WebhookEntry[]) => void
  disabled?: boolean
  isFreeAction?: boolean
  iconProps?: {
    color?: string
    style?: React.CSSProperties
    id?: string
  }
}

/**
 * Material Table column configuration for WebhookEntry
 */
export interface WebhookTableColumn {
  title: string
  field?: string
  width?: string
  render?: (rowData: WebhookEntry) => React.ReactNode
  headerStyle?: React.CSSProperties
  cellStyle?: React.CSSProperties
}
