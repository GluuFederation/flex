import type React from 'react'
import type { ThemeValue } from '@/context/theme/constants'

export type JsonViewerProps = {
  data: unknown
  theme?: ThemeValue
  expanded?: boolean
  style?: React.CSSProperties
  className?: string
}

export type JsonViewerDialogProps = {
  isOpen: boolean
  toggle: () => void
  data?: unknown
  isLoading?: boolean
  title?: string
  theme?: ThemeValue
  expanded?: boolean
}
