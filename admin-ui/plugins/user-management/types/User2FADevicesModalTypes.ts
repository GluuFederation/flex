import type { UserTableRowData } from './ComponentTypes'

export type User2FADevicesModalProps = {
  isOpen: boolean
  onClose: () => void
  userDetails: UserTableRowData | null
  theme: string
}
