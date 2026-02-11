import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface ColumnDef<T> {
  key: string
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: T[keyof T], row: T, rowIndex: number) => ReactNode
}

export interface ActionDef<T> {
  icon: ReactNode | string
  tooltip?: string
  onClick: (row: T) => void
  show?: (row: T) => boolean
  color?: string
}

export interface PaginationConfig {
  page: number
  rowsPerPage: number
  totalItems: number
  rowsPerPageOptions?: number[]
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
}

export interface GluuTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  loading?: boolean
  expandable?: boolean
  renderExpandedRow?: (item: T) => ReactNode
  pagination?: PaginationConfig
  actions?: ActionDef<T>[]
  sortColumn?: string | null
  sortDirection?: SortDirection
  onSort?: (columnKey: string, direction: SortDirection) => void
  getRowKey?: (item: T, index: number) => string | number
  emptyMessage?: string
  stickyHeader?: boolean
}
