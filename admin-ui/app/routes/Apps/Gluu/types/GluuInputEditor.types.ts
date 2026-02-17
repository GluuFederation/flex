import type { FormikProps } from 'formik'

type GluuInputEditorCursorValue = {
  cursor: {
    row: number
    column: number
    document?: { $lines: string[] }
  }
}

export type GluuInputEditorProps<T extends object> = {
  name: string
  language: string
  value?: string
  formik: FormikProps<T>
  required?: boolean
  lsize?: number
  rsize?: number
  doc_category?: string
  readOnly?: boolean
  label: string
  showError?: boolean
  errorMessage?: string
  theme?: string
  placeholder?: string
  doc_entry?: string
  shortcode?: React.ReactNode
  onCursorChange?: (value: GluuInputEditorCursorValue) => void
  width?: string
  isDark?: boolean
}
