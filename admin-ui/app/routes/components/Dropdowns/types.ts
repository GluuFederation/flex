import type React from 'react'
import type { DropdownPosition } from 'Components'

export type UserInfo = {
  user_name?: string
  name?: string
  given_name?: string
  [key: string]: string | number | boolean | undefined
}

export type LogoutAuditState = {
  logoutAuditReducer: {
    logoutAuditSucceeded: boolean
  }
}

export type DropdownProfileProps = {
  trigger: React.ReactNode
  position?: DropdownPosition
}
