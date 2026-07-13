import type React from 'react'
import type { DropdownPosition, GluuDropdownOption } from 'Components'
import type { UserInfo } from 'Redux/features/types/authTypes'

export type DropdownProfileProps = {
  trigger?: React.ReactNode
  renderTrigger?: (
    isOpen: boolean,
    selectedOption?: GluuDropdownOption<string> | GluuDropdownOption<string>[],
  ) => React.ReactNode
  position?: DropdownPosition
}

export type MobileProfileDropdownProps = {
  userInfo: UserInfo | null
  renderTrigger: (isOpen: boolean) => React.ReactNode
}
