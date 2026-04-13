import type { CSSProperties } from 'react'

export type GluuDetailGridField = {
  label: string
  value?: string | number | boolean | null
  doc_entry?: string
  doc_category?: string
  isBadge?: boolean
  badgeBackgroundColor?: string
  badgeTextColor?: string
  isDirect?: boolean
  lsize?: number
  rsize?: number
  labelStyle?: CSSProperties
  valueStyle?: CSSProperties
  rowClassName?: string
  layout?: 'row' | 'column'
  fullWidth?: boolean
}

export type GluuDetailGridProps = {
  fields: GluuDetailGridField[]
  labelStyle?: CSSProperties
  defaultDocCategory?: string
  className?: string
  layout?: 'row' | 'column'
}
