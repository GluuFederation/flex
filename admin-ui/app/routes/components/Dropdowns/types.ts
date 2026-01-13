import type React from 'react'
import type { DropdownPosition } from 'Components'

export type LogoutAuditState = {
  logoutAuditReducer: {
    logoutAuditSucceeded: boolean
  }
}

export type DropdownProfileProps = {
  trigger: React.ReactNode
  position?: DropdownPosition
}
