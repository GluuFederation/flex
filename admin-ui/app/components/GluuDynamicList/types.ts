import type React from 'react'

export type GluuDynamicListField = 'key' | 'value'

export type GluuDynamicListMode = 'single' | 'pair'

export type GluuDynamicListItem = {
  id?: string
  key?: string
  value?: string
}

export type GluuDynamicListProps = {
  title: string
  label?: string
  required?: boolean
  items: GluuDynamicListItem[]
  mode?: GluuDynamicListMode
  disabled?: boolean
  keyPlaceholder?: string
  valuePlaceholder: string
  addButtonLabel: string
  removeButtonLabel: string
  validateItem?: (item: GluuDynamicListItem, mode: GluuDynamicListMode) => boolean
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, field: GluuDynamicListField, value: string) => void
  showError?: boolean
  errorMessage?: string
  getItemKey?: (item: GluuDynamicListItem, index: number) => string | number
  className?: string
  style?: React.CSSProperties
}
