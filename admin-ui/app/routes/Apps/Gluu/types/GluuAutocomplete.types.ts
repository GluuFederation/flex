export type AutocompleteOption = {
  value: string
  label: string
}

export type GluuAutocompleteProps = {
  label: string
  name: string
  value: string[]
  options: readonly (string | AutocompleteOption)[]
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
  doc_entry?: string
  surfaceColor?: string
  contrastOptionHover?: boolean
  withWrapper?: boolean
  hideLabel?: boolean
  required?: boolean
  showError?: boolean
  errorMessage?: string
  helperText?: string
  hideHelperWhenSelected?: boolean
  compactSelectionSpacing?: boolean
}
