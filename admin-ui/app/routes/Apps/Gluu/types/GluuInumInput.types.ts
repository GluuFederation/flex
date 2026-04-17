import type { ChangeEventHandler } from 'react'

export type GluuInumInputProps = {
  label: string
  name: string
  value?: string | number
  lsize?: number
  rsize?: number
  doc_category?: string
  isDark?: boolean
  handleChange?: ChangeEventHandler<HTMLInputElement>
}
