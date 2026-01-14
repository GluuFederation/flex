import type React from 'react'
import type { DropdownPosition, GluuDropdownOption, GluuDropdownProps } from '../GluuDropdown/types'

export type { DropdownPosition }

export type DropdownOption = Omit<
  GluuDropdownOption<string | number>,
  'onClick' | 'divider' | 'icon' | 'metadata'
> & {
  onClick?: () => void
}

export type ThemeDropdownProps = Pick<
  GluuDropdownProps<string | number>,
  'position' | 'className' | 'dropdownClassName' | 'minWidth' | 'maxWidth' | 'showArrow'
> & {
  trigger: React.ReactNode
  options: DropdownOption[]
  selectedValue?: string | number
  onSelect?: (value: string | number) => void
}
