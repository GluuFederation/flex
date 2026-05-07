export type MultiSelectOption = {
  value: string
  label: string
}

export type GluuMultiSelectRowFormik = {
  setFieldValue: (field: string, value: string[]) => void
  setFieldTouched: (field: string, isTouched?: boolean) => void
}

export type GluuMultiSelectRowProps = {
  label: string
  name: string
  value?: string[]
  formik: GluuMultiSelectRowFormik
  options: MultiSelectOption[]
  lsize?: number
  rsize?: number
  doc_category?: string
  doc_entry?: string
  disabled?: boolean
  required?: boolean
  showError?: boolean
  errorMessage?: string
  isDark?: boolean
  helperText?: string
  placeholder?: string
  inputBackgroundColor?: string
  hideHelperWhenSelected?: boolean
  compactSelectionSpacing?: boolean
}
