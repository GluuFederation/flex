import type { JsonValue } from './common'

export type GluuCommitDialogOperation = {
  path: string
  value: JsonValue
}

export type GluuCommitDialogProps = {
  handler: () => void
  modal: boolean
  onAccept: (message: string) => void | Promise<void>
  formik?: { setFieldValue: (field: string, value: string) => void } | null
  operations?: GluuCommitDialogOperation[]
  label?: string
  placeholderLabel?: string
  alertMessage?: string
  alertSeverity?: 'error' | 'warning' | 'info' | 'success'
  inputType?: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  feature?: string
  isLicenseLabel?: boolean
  autoCloseOnAccept?: boolean
}
