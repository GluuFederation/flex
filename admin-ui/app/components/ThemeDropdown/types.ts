import type React from 'react'
import type { DropdownPosition } from '../GluuDropdown/types'

export type { DropdownPosition }

export type DropdownOption = {
  value: string | number
  label: string | React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export type ThemeDropdownProps = {
  trigger: React.ReactNode
  options: DropdownOption[]
  position?: DropdownPosition
  selectedValue?: string | number
  onSelect?: (value: string | number) => void
  className?: string
  dropdownClassName?: string
  minWidth?: number | string
  maxWidth?: number | string
  showArrow?: boolean
}
