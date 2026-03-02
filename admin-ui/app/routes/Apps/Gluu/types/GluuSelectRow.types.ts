export type SelectOption = {
  value: string
  label: string
}

export type GluuSelectRowFormik = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export type GluuSelectRowProps = {
  label: string
  name: string
  value?: string | number
  formik: GluuSelectRowFormik
  values?: Array<string | SelectOption>
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  showError?: boolean
  errorMessage?: string
  doc_entry?: string
  isDark?: boolean
  /** When true, renders MUI Autocomplete with freeSolo so value can display even if not in options */
  freeSolo?: boolean
  /** When freeSolo, called with selected value on change */
  onValueChange?: (value: string | null) => void
  /** When freeSolo, optional height for the input (e.g. 40) */
  inputHeight?: number
  /** When freeSolo, optional padding top/bottom for the input (e.g. 8) */
  inputPaddingTop?: number
  inputPaddingBottom?: number
}
