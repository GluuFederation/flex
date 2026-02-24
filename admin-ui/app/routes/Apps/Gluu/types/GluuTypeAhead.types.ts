import type { MutableRefObject } from 'react'
import type { TypeaheadRef } from 'react-bootstrap-typeahead'
import type { FormikContextType } from 'formik'

export type GluuTypeAheadOption = string | Record<string, unknown>

export type GluuTypeAheadProps = {
  label: string
  labelKey?: string | ((option: GluuTypeAheadOption) => string)
  name: string
  value?: GluuTypeAheadOption[]
  options: GluuTypeAheadOption[]
  formik?: FormikContextType<Record<string, unknown>> | null
  required?: boolean
  doc_category?: string
  doc_entry?: string
  forwardRef?: MutableRefObject<TypeaheadRef | null> | null
  onChange?: ((selected: GluuTypeAheadOption[]) => void) | null
  lsize?: number
  rsize?: number
  disabled?: boolean
  showError?: boolean
  errorMessage?: string
  allowNew?: boolean
  isLoading?: boolean
  multiple?: boolean
  hideHelperMessage?: boolean
  minLength?: number
  emptyLabel?: string
  isDark?: boolean
}
