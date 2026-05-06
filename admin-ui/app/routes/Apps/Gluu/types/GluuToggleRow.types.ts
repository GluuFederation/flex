import type { FormikProps } from 'formik'
import type { JsonValue } from './common'
import type { CSSProperties } from 'react'

export type GluuToggleRowProps<T extends object = Record<string, JsonValue>> = {
  label: string
  name: string
  value?: boolean
  formik?: FormikProps<T> | null
  lsize?: number
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void
  rsize?: number
  doc_category?: string
  doc_entry?: string
  disabled?: boolean
  required?: boolean
  isLabelVisible?: boolean
  labelStyle?: CSSProperties
  isDark?: boolean
  viewOnly?: boolean
}
