import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export type ColumnKey<T> = Extract<keyof T, string>

export interface ExpandContext {
  isExpanded: boolean
  rowKey: string | number
}

export interface ColumnDef<T, K extends ColumnKey<T> = ColumnKey<T>> {
  key: K
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: T[K], row: T, rowIndex: number, context?: ExpandContext) => ReactNode
}

export interface ActionDef<T> {
  icon: ReactNode | string
  tooltip?: string
  ariaLabel?: string
  id?: string | number
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

/** When Settings (or another tab) changes paging size, GluuTable can notify so the parent can sync and refetch. Optional. */
export type OnPagingSizeSync = (newSize: number) => void

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
  /** Optional class applied to the <table> for parent overrides (e.g. Audit) */
  tableClassName?: string
  /** When provided with pagination, GluuTable listens for paging-size changes (Settings / visibility) and calls this so the parent can sync and refetch. */
  onPagingSizeSync?: OnPagingSizeSync
}
