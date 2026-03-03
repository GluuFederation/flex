export type GluuInlineAlertSeverity = 'error' | 'warning' | 'info'

export interface GluuInlineAlertProps {
  /** Short title (e.g. "Error loading scripts") */
  title: string
  /** Optional detail message (e.g. "Request failed with status code 500") */
  detail?: string
  severity?: GluuInlineAlertSeverity
  /** Optional class name for the root element */
  className?: string
}
