import type { ReactNode } from 'react'
import type { Dayjs } from '@/utils/dayjsUtils'
import type { ThemeConfig } from '@/context/theme/config'

export type FilterFieldOption = {
  value: string
  label: string
}

export type FilterField = {
  key: string
  label?: string
  value: string
  options?: FilterFieldOption[]
  type?: 'select' | 'text' | 'date'
  placeholder?: string
  onChange: (value: string) => void
  dateValue?: Dayjs | null
  onDateChange?: (date: Dayjs | null) => void
  width?: number | string
  fullWidth?: boolean
}

export type GluuFilterPopoverProps = {
  open: boolean
  fields: FilterField[]
  onApply: () => void
  onCancel: () => void
  applyLabel?: string
  cancelLabel?: string
  columns?: number
  width?: number | string
  className?: string
  children?: ReactNode
}

export type StyleParams = {
  themeColors: ThemeConfig
  isDark: boolean
  width?: number | string
  columns: number
}
