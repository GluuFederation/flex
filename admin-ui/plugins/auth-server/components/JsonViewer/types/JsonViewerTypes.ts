import type React from 'react'
import type { ThemeValue } from '@/context/theme/constants'
import type { JsonObject, JsonValue } from '@/routes/Apps/Gluu/types/common'
import { useStyles } from '../JsonViewer.style'

export type JsonViewerProps = {
  data: JsonValue
  theme?: ThemeValue
  expanded?: boolean
  style?: React.CSSProperties
  className?: string
  backgroundColor?: string
}

export type JsonViewerDialogProps = {
  isOpen: boolean
  toggle: () => void
  data?: JsonValue
  isLoading?: boolean
  title?: string
  theme?: ThemeValue
  expanded?: boolean
}

export type JsonViewerClasses = ReturnType<typeof useStyles>['classes']
export type JsonViewerData = JsonObject | JsonValue[]
