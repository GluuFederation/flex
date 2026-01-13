import type React from 'react'
import type { DropdownPosition, GluuDropdownOption, GluuDropdownProps } from '../GluuDropdown/types'

export type { DropdownPosition }

export type DropdownOption = Omit<
  GluuDropdownOption<string | number>,
  'onClick' | 'divider' | 'icon' | 'metadata'
> & {
  onClick?: () => void
}

export type ThemeDropdownProps = Omit<
  Pick<
    GluuDropdownProps<string | number>,
    | 'position'
    | 'selectedValue'
    | 'onSelect'
    | 'className'
    | 'dropdownClassName'
    | 'minWidth'
    | 'maxWidth'
    | 'showArrow'
  >,
  'selectedValue' | 'onSelect'
> & {
  trigger: React.ReactNode
  options: DropdownOption[]
  selectedValue?: string | number
  onSelect?: (value: string | number) => void
}
