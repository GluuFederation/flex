export interface MultiValueSelectCardProps {
  label: string
  name: string
  value: string[]
  options: string[]
  onChange: (value: string[]) => void
  onBlur?: () => void
  disabled?: boolean
  placeholder?: string
  allowCustom?: boolean
  onRemoveField?: () => void
  doc_category?: string
}
