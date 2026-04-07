import type { ReactNode } from 'react'
import type { PageConfig } from 'Components/Layout/types'

export type EmptyLayoutProps = {
  pageConfig?: PageConfig | null
  children: ReactNode
  className?: string
}

export type SectionProps = {
  className?: string
  children: ReactNode
  center?: boolean
  width?: number | string
}
