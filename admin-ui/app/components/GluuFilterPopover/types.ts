import type { ReactNode } from 'react'
import type { Dayjs } from '@/utils/dayjsUtils'

export interface FilterFieldOption {
  value: string
  label: string
}

export interface FilterField {
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

export interface GluuFilterPopoverProps {
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
