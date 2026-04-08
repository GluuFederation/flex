import type { FormikProps } from 'formik'
import type { JsonObject } from './common'

export type GluuTypeAheadWithAddProps = {
  label: string
  name: string
  value?: string[]
  placeholder?: string
  options?: string[]
  formik: FormikProps<JsonObject>
  validator: (value: string) => boolean
  inputId: string
  doc_category?: string
  lsize?: number
  rsize?: number
  disabled?: boolean
  handler?: ((name: string, updatedItems: string[]) => void) | null
  multiple?: boolean
}
