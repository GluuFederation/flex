import type { FormikProps } from 'formik'
import type { JsonValue } from './common'

export type GluuToggleRowProps<T extends Record<string, JsonValue> = Record<string, JsonValue>> = {
  formik: FormikProps<T>
  label: string
  viewOnly?: boolean
  lsize?: number
  rsize?: number
  name: string
  doc_category?: string
}
