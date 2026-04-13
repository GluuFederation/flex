import type React from 'react'

export type DropdownPosition = 'top' | 'bottom' | 'left' | 'right'

export type DropdownValue = string | number | boolean

export type GluuDropdownOption<T extends DropdownValue = DropdownValue> = {
  value: T
  label: string | React.ReactNode
  onClick?: (value: T, option: GluuDropdownOption<T>) => void
  disabled?: boolean
  divider?: boolean
  icon?: React.ReactNode
  metadata?: Record<string, string | number | boolean | null | undefined>
  searchValue?: string
}

export type GluuDropdownProps<T extends DropdownValue = DropdownValue> = {
  trigger?: React.ReactNode
  options: GluuDropdownOption<T>[]
  position?: DropdownPosition
  selectedValue?: T | T[]
  onSelect?: (value: T, option: GluuDropdownOption<T>) => void
  onOpenChange?: (isOpen: boolean) => void
  className?: string
  dropdownClassName?: string
  minWidth?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  showArrow?: boolean
  closeOnSelect?: boolean
  closeOnOutsideClick?: boolean
  disabled?: boolean
  controlled?: boolean
  isOpen?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  multiple?: boolean
  renderOption?: (option: GluuDropdownOption<T>, isSelected: boolean) => React.ReactNode
  renderTrigger?: (
    isOpen: boolean,
    selectedOption?: GluuDropdownOption<T> | GluuDropdownOption<T>[],
  ) => React.ReactNode
  centerText?: boolean
}

export type DropdownState = {
  isOpen: boolean
  searchQuery: string
}
