import type React from 'react'
import type { DropdownPosition, GluuDropdownOption } from 'Components'

export type LogoutAuditState = {
  logoutAuditReducer: {
    logoutAuditSucceeded: boolean
  }
}

export type DropdownProfileProps = {
  trigger?: React.ReactNode
  renderTrigger?: (
    isOpen: boolean,
    selectedOption?: GluuDropdownOption<string> | GluuDropdownOption<string>[],
  ) => React.ReactNode
  position?: DropdownPosition
}
