export type GluuAutocompleteProps = {
  label: string
  name: string
  value: string[]
  options: readonly string[]
  onChange: (value: string[]) => void
  onBlur?: () => void
  disabled?: boolean
  placeholder?: string
  /** When true, allow typing a value not in options and adding it */
  allowCustom?: boolean
  /** Called when the text input changes — use this to trigger async search */
  onSearch?: (value: string) => void
  /** When true, shows a loading indicator in the dropdown */
  isLoading?: boolean
  onRemoveField?: () => void
  doc_category?: string
  inputBackgroundColor?: string
  cardBackgroundColor?: string
  withWrapper?: boolean
  hideLabel?: boolean
  required?: boolean
  showError?: boolean
  errorMessage?: string
  helperText?: string
}
