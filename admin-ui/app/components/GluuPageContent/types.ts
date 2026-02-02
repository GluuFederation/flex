import type { ReactNode } from 'react'

export type GluuPageContentProps = {
  children: ReactNode
  className?: string
  withVerticalPadding?: boolean
  maxWidth?: number
  backgroundColor?: string
}
