import type { ReactNode } from 'react'

export type ModalLayerProps = {
  onClose: () => void
  overlayClassName?: string
  children: ReactNode
}
