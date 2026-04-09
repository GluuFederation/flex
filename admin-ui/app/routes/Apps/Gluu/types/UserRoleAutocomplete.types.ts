export interface UserRoleAutocompleteProps {
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
  onRemoveField?: () => void
  doc_category?: string
  inputBackgroundColor?: string
  withWrapper?: boolean
  required?: boolean
  showError?: boolean
  errorMessage?: string
  helperText?: string
}
