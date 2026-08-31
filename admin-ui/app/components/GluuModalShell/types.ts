import type { ReactNode } from 'react'

export type GluuModalShellProps = {
  onClose: () => void
  ariaLabelledBy?: string
  closeOnOverlayClick?: boolean
  containerClassName?: string
  contentClassName?: string
  children: ReactNode
}
