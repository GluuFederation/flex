import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { GluuSpinner } from '@/components/GluuSpinner'
import { useStyles } from './GluuTable.style'
import type { CellValue, ColumnKey, GluuTableProps, SortDirection } from './types'
import { ChevronIcon } from '@/components/SVG'
import {
  getDefaultPagingSize,
  getRowsPerPageOptions,
  PAGING_SIZE_CHANGED_EVENT,
} from '@/utils/pagingUtils'

const MIN_COL_WIDTH = 60

const parseMinWidth = (col: { minWidth?: string | number }): string | number | undefined => {
  const mw = col.minWidth
  if (typeof mw === 'number' && mw > 0) return mw
  if (typeof mw === 'string') return mw.trim()
  return undefined
}

const parseMaxWidth = (col: { maxWidth?: string | number }): string | undefined => {
  const mw = col.maxWidth
  if (mw == null) return undefined
  if (typeof mw === 'number' && mw > 0) return `${mw}px`
  if (typeof mw === 'string' && mw.trim()) return mw.trim()
  return undefined
}

const parseColumnWidth = (col: { width?: string | number }): string | undefined => {
  const w = col.width
  if (w == null) return undefined
  if (typeof w === 'number' && w > 0) return `${w}px`
  if (typeof w === 'string' && w.trim()) return w.trim()
  return undefined
}

const EMPTY_TABLE_ESTIMATE = 15

const computeContentBasedWidths = <T,>(
  columns: { key: ColumnKey<T>; label: string }[],
  data: T[],
): Record<string, string> => {
  const totalCols = columns.length
  if (totalCols === 0) return {}

  const scores: number[] = columns.map((col) => {
    const headerLen = col.label.length
    let maxContentLen = headerLen
    for (const row of data) {
      const len = String(row[col.key] ?? '').length
      maxContentLen = Math.max(maxContentLen, len)
    }
    if (data.length === 0) {
      maxContentLen = Math.max(maxContentLen, EMPTY_TABLE_ESTIMATE)
    }
    return 1 + maxContentLen * 0.02
  })

  const totalScore = scores.reduce((a, b) => a + b, 0)
  const rawPcts = scores.map((s) => (s / totalScore) * 100)
  const clamped = rawPcts.map((p) => Math.max(14, Math.min(42, p)))
  const sumClamped = clamped.reduce((a, b) => a + b, 0)
  const pcts =
    sumClamped > 0 ? clamped.map((p) => (p / sumClamped) * 100) : clamped.map(() => 100 / totalCols)

  return Object.fromEntries(columns.map((col, i) => [col.key, `${pcts[i].toFixed(1)}%`]))
}

const compareValues = (a: CellValue, b: CellValue, direction: 'asc' | 'desc'): number => {
  const emptyA = a == null || a === ''
  const emptyB = b == null || b === ''
  if (emptyA && emptyB) return 0
  if (emptyA) return 1
  if (emptyB) return -1
  let cmp: number
  if (typeof a === 'number' && typeof b === 'number') {
    cmp = a - b
  } else if (typeof a === 'boolean' && typeof b === 'boolean') {
    cmp = (a ? 1 : 0) - (b ? 1 : 0)
  } else {
    cmp = String(a).localeCompare(String(b), undefined, { numeric: true })
  }
  return direction === 'desc' ? -cmp : cmp
}

const T_KEYS = {
  FIELDS_ACTIONS: 'fields.actions',
  FIELDS_OF: 'fields.of',
  FIELDS_ROWS_PER_PAGE: 'fields.rows_per_page',
  MESSAGES_LOADING: 'messages.loading',
  MESSAGES_NO_DATA: 'messages.no_data_available',
  MESSAGES_COLLAPSE: 'messages.collapse',
  MESSAGES_EXPAND: 'messages.expand',
  MESSAGES_PREVIOUS_PAGE: 'messages.previous_page',
  MESSAGES_NEXT_PAGE: 'messages.next_page',
} as const

const GluuTable = <T,>(props: Readonly<GluuTableProps<T>>) => {
  const {
    columns,
    data,
    loading = false,
    expandable = false,
    renderExpandedRow,
    pagination,
    actions,
    getRowKey,
    emptyMessage,
    stickyHeader = false,
    tableClassName,
    onPagingSizeSync,
    expandColumnWidth,
  } = props

  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set())
  const [resizedColumnWidths, setResizedColumnWidths] = useState<Record<string, number>>({})
  const [sortState, setSortState] = useState<{ column: string | null; direction: SortDirection }>({
    column: null,
    direction: null,
  })

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return data
    const dir = sortState.direction
    const colKey = sortState.column as ColumnKey<T>
    const indexed = data.map((item, idx) => ({ item, idx }))
    indexed.sort((a, b) => {
      const cmp = compareValues(a.item[colKey] as CellValue, b.item[colKey] as CellValue, dir)
      return cmp !== 0 ? cmp : a.idx - b.idx
    })
    return indexed.map(({ item }) => item)
  }, [data, sortState])

  const computedWidths = useMemo(() => computeContentBasedWidths(columns, data), [columns, data])
  const effectiveWidths = useMemo(() => {
    const out: Record<string, string> = {}
    for (const col of columns) {
      const parentWidth = parseColumnWidth(col)
      const resized = resizedColumnWidths[col.key]
      out[col.key] =
        parentWidth ??
        (resized != null ? `${resized}%` : (computedWidths[col.key] ?? `${100 / columns.length}%`))
    }
    return out
  }, [columns, resizedColumnWidths, computedWidths])

  const { classes } = useStyles({ isDark, themeColors, stickyHeader })

  const tableRef = useRef<HTMLTableElement>(null)
  const headerCellRefs = useRef<Map<string, HTMLTableCellElement>>(new Map())

  const setHeaderCellRef = useCallback((colKey: string, el: HTMLTableCellElement | null) => {
    if (el) {
      headerCellRefs.current.set(colKey, el)
    } else {
      headerCellRefs.current.delete(colKey)
    }
  }, [])

  const handleResizeStart = useCallback(
    (colKey: string, clientX: number, resizeHandle: HTMLElement) => {
      const th = headerCellRefs.current.get(colKey) ?? resizeHandle.closest('th')
      if (!th) return
      const colIndex = columns.findIndex((c) => c.key === colKey)
      const nextCol = colIndex >= 0 ? columns[colIndex + 1] : undefined
      const nextTh = nextCol ? headerCellRefs.current.get(nextCol.key) : undefined

      const table = tableRef.current
      const tableWidth = table?.getBoundingClientRect().width ?? 0
      const startWidthI = th.getBoundingClientRect().width
      const startWidthNext = nextTh?.getBoundingClientRect().width ?? 0
      let totalDelta = 0
      let lastClientX = clientX

      const onMove = (ev: { clientX: number }) => {
        totalDelta += ev.clientX - lastClientX
        lastClientX = ev.clientX

        if (nextCol && tableWidth > 0) {
          const minPx = MIN_COL_WIDTH
          let newWidthI = startWidthI + totalDelta
          let newWidthNext = startWidthNext - totalDelta
          if (newWidthI < minPx) {
            newWidthI = minPx
            newWidthNext = startWidthI + startWidthNext - minPx
          } else if (newWidthNext < minPx) {
            newWidthNext = minPx
            newWidthI = startWidthI + startWidthNext - minPx
          }
          const pctI = (newWidthI / tableWidth) * 100
          const pctNext = (newWidthNext / tableWidth) * 100
          setResizedColumnWidths((prev) => ({
            ...prev,
            [colKey]: Math.round(pctI * 10) / 10,
            [nextCol.key]: Math.round(pctNext * 10) / 10,
          }))
        } else if (tableWidth > 0) {
          const minPx = MIN_COL_WIDTH
          const newWidthI = Math.max(minPx, startWidthI + totalDelta)
          const pctI = (newWidthI / tableWidth) * 100
          setResizedColumnWidths((prev) => ({ ...prev, [colKey]: Math.round(pctI * 10) / 10 }))
        }
      }

      const onUp = () => {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        window.removeEventListener('mousemove', onMoveMouse)
        window.removeEventListener('mouseup', onUpMouse)
        window.removeEventListener('touchmove', onMoveTouch)
        window.removeEventListener('touchend', onUpTouch)
      }
      const onMoveMouse = (ev: MouseEvent) => onMove(ev)
      const onUpMouse = () => onUp()
      const onMoveTouch = (ev: TouchEvent) => {
        ev.preventDefault()
        if (ev.touches.length > 0) onMove(ev.touches[0])
      }
      const onUpTouch = () => onUp()
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', onMoveMouse)
      window.addEventListener('mouseup', onUpMouse)
      window.addEventListener('touchmove', onMoveTouch as EventListener, { passive: false })
      window.addEventListener('touchend', onUpTouch)
    },
    [columns],
  )

  useEffect(() => {
    setExpandedRows(new Set())
  }, [data])

  const rowsPerPageRef = useRef(pagination?.rowsPerPage ?? 0)
  rowsPerPageRef.current = pagination?.rowsPerPage ?? 0
  useEffect(() => {
    if (!pagination || !onPagingSizeSync) return
    const notifyIfChanged = (newSize: number) => {
      if (newSize !== rowsPerPageRef.current) onPagingSizeSync(newSize)
    }
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail
      const newSize = detail != null && Number.isInteger(detail) ? detail : getDefaultPagingSize()
      notifyIfChanged(newSize)
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        notifyIfChanged(getDefaultPagingSize())
      }
    }
    window.addEventListener(PAGING_SIZE_CHANGED_EVENT, handler)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener(PAGING_SIZE_CHANGED_EVENT, handler)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [pagination, onPagingSizeSync])

  const totalCols = (expandable ? 1 : 0) + columns.length + (actions?.length ? 1 : 0)
  const defaultEmptyMessage = useMemo(() => t(T_KEYS.MESSAGES_NO_DATA), [t])

  const toggleRow = useCallback((key: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const resolveRowKey = useCallback(
    (item: T, index: number): string | number => {
      if (getRowKey) return getRowKey(item, index)
      const row = item as { id?: string | number }
      return row.id ?? index
    },
    [getRowKey],
  )

  const handleSort = useCallback((columnKey: string) => {
    setSortState((prev) => {
      const isSameColumn = prev.column === columnKey
      const nextDirection: SortDirection = !isSameColumn
        ? 'asc'
        : prev.direction === 'asc'
          ? 'desc'
          : null
      return {
        column: nextDirection ? columnKey : null,
        direction: nextDirection,
      }
    })
  }, [])

  const renderActionCell = useCallback(
    (row: T) => {
      if (!actions?.length) return null
      return (
        <div className={classes.actionsCell}>
          {actions.map((action, idx) => {
            if (action.show && !action.show(row)) return null
            const actionLabel = action.ariaLabel ?? action.tooltip ?? t(T_KEYS.FIELDS_ACTIONS)
            return (
              <button
                key={action.id ?? idx}
                type="button"
                className={classes.actionButton}
                style={action.color ? { color: action.color } : undefined}
                title={action.tooltip}
                aria-label={actionLabel}
                onClick={() => action.onClick(row)}
              >
                {typeof action.icon === 'string' ? (
                  <i className={action.icon} style={{ fontSize: '16px' }} />
                ) : (
                  action.icon
                )}
              </button>
            )
          })}
        </div>
      )
    },
    [actions, classes, t],
  )

  const isFirstPage = pagination ? pagination.page === 0 : false
  const isLastPage = pagination
    ? (pagination.page + 1) * pagination.rowsPerPage >= pagination.totalItems
    : false

  return (
    <div className={classes.root}>
      {loading && (
        <div className={classes.loadingOverlay}>
          <GluuSpinner size={32} aria-label={t(T_KEYS.MESSAGES_LOADING)} />
        </div>
      )}

      <div className={classes.borderWrapper}>
        <div className={classes.wrapper} data-gluu-table>
          <table
            ref={tableRef}
            className={[classes.table, tableClassName].filter(Boolean).join(' ')}
          >
            <colgroup>
              {expandable && <col style={{ width: expandColumnWidth ?? 40 }} />}
              {columns.map((col, colIdx) => {
                const w = effectiveWidths[col.key]
                const minW = parseMinWidth(col)
                const maxW = parseMaxWidth(col)
                return (
                  <col
                    key={`${col.key}-${colIdx}`}
                    style={{
                      width: w,
                      ...(minW != null && { minWidth: minW }),
                      ...(maxW != null && { maxWidth: maxW }),
                    }}
                  />
                )
              })}
              {actions && actions.length > 0 && <col style={{ width: actions.length * 40 + 16 }} />}
            </colgroup>
            <thead>
              <tr>
                {expandable && (
                  <th
                    className={`${classes.headerCell} ${classes.headerCellExpand}`}
                    style={
                      expandColumnWidth != null
                        ? {
                            width: expandColumnWidth,
                            minWidth: expandColumnWidth,
                            maxWidth: expandColumnWidth,
                          }
                        : undefined
                    }
                  />
                )}
                {columns.map((col, colIdx) => {
                  const isSortable = col.sortable !== false
                  const isActive = sortState.column === col.key
                  return (
                    <th
                      ref={(el) => setHeaderCellRef(col.key, el)}
                      key={`${col.key}-${colIdx}`}
                      className={`${classes.headerCell} ${classes.headerCellResizable}`}
                      style={{
                        width: effectiveWidths[col.key],
                        ...(parseMinWidth(col) != null && { minWidth: parseMinWidth(col) }),
                        ...(parseMaxWidth(col) != null && { maxWidth: parseMaxWidth(col) }),
                        textAlign: col.align || 'left',
                      }}
                    >
                      {isSortable ? (
                        <button
                          type="button"
                          className={
                            isActive
                              ? `${classes.sortableHeader} ${classes.sortableHeaderActive}`
                              : classes.sortableHeader
                          }
                          onClick={() => handleSort(col.key)}
                        >
                          {col.label}
                          <span className={classes.sortIconWrap} data-sort-icon>
                            <ChevronIcon
                              width={14}
                              height={14}
                              direction={isActive && sortState.direction === 'asc' ? 'up' : 'down'}
                            />
                          </span>
                        </button>
                      ) : (
                        <GluuText variant="span" disableThemeColor>
                          {col.label}
                        </GluuText>
                      )}
                      <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label="Resize column"
                        className={classes.resizeHandle}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleResizeStart(col.key, e.clientX, e.currentTarget)
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault()
                          if (e.touches.length > 0) {
                            handleResizeStart(col.key, e.touches[0].clientX, e.currentTarget)
                          }
                        }}
                      />
                    </th>
                  )
                })}
                {actions && actions.length > 0 && (
                  <th
                    className={`${classes.headerCell} ${classes.headerCellActions}`}
                    style={{ width: actions.length * 40 + 16 }}
                  >
                    <GluuText variant="span" disableThemeColor>
                      {t(T_KEYS.FIELDS_ACTIONS)}
                    </GluuText>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={totalCols} className={classes.emptyRow}>
                    <GluuText variant="span" disableThemeColor>
                      {emptyMessage ?? defaultEmptyMessage}
                    </GluuText>
                  </td>
                </tr>
              ) : (
                sortedData.map((row, rowIdx) => {
                  const rowKey = resolveRowKey(row, rowIdx)
                  const isExpanded = expandedRows.has(rowKey)
                  return (
                    <React.Fragment key={rowKey}>
                      <tr className={classes.row}>
                        {expandable && (
                          <td
                            className={`${classes.cell} ${classes.cellExpand}`}
                            style={
                              expandColumnWidth != null
                                ? {
                                    width: expandColumnWidth,
                                    minWidth: expandColumnWidth,
                                    maxWidth: expandColumnWidth,
                                  }
                                : undefined
                            }
                          >
                            <div className={classes.cellExpandInner}>
                              <button
                                type="button"
                                className={classes.expandButton}
                                data-expand-button
                                aria-expanded={isExpanded}
                                aria-label={t(
                                  isExpanded ? T_KEYS.MESSAGES_COLLAPSE : T_KEYS.MESSAGES_EXPAND,
                                  { defaultValue: isExpanded ? 'Collapse row' : 'Expand row' },
                                )}
                                title={
                                  isExpanded
                                    ? t(T_KEYS.MESSAGES_COLLAPSE, { defaultValue: 'Collapse' })
                                    : t(T_KEYS.MESSAGES_EXPAND, { defaultValue: 'Expand' })
                                }
                                onClick={() => toggleRow(rowKey)}
                                style={{ color: themeColors.fontColor }}
                              >
                                <ExpandMoreIcon
                                  className={`${classes.expandIcon} ${isExpanded ? classes.expandIconOpen : ''}`}
                                  sx={{ fontSize: 20, color: 'inherit' }}
                                />
                              </button>
                            </div>
                          </td>
                        )}
                        {columns.map((col, colIdx) => {
                          const key = col.key as ColumnKey<T>
                          const value = (row as T)[key]
                          const isFirstLineColumn = expandable && colIdx <= 1
                          return (
                            <td
                              key={`${col.key}-${colIdx}`}
                              className={`${classes.cell} ${isFirstLineColumn ? classes.cellFirst : ''}`}
                              style={{
                                width: effectiveWidths[col.key],
                                ...(parseMinWidth(col) != null && { minWidth: parseMinWidth(col) }),
                                ...(parseMaxWidth(col) != null && { maxWidth: parseMaxWidth(col) }),
                                textAlign: col.align || 'left',
                              }}
                            >
                              {col.render ? (
                                col.render(value, row, rowIdx, {
                                  isExpanded,
                                  rowKey,
                                })
                              ) : (
                                <GluuText variant="span" disableThemeColor>
                                  {String(value ?? '')}
                                </GluuText>
                              )}
                            </td>
                          )
                        })}
                        {actions && actions.length > 0 && (
                          <td className={classes.cell} style={{ textAlign: 'center' }}>
                            {renderActionCell(row)}
                          </td>
                        )}
                      </tr>
                      {expandable && isExpanded && renderExpandedRow != null && (
                        <tr>
                          <td colSpan={totalCols} className={classes.expandedPanel}>
                            {renderExpandedRow(row)}
                          </td>
                        </tr>
                      )}
                      <tr className={classes.dividerRow} aria-hidden="true">
                        <td colSpan={totalCols} className={classes.dividerCell} data-divider-cell />
                      </tr>
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>

          {pagination && (
            <div className={classes.paginationBar}>
              <GluuText variant="span" disableThemeColor>
                {t(T_KEYS.FIELDS_ROWS_PER_PAGE)}:
              </GluuText>
              <div className={classes.paginationSelectWrap}>
                <select
                  className={classes.paginationSelect}
                  value={pagination.rowsPerPage}
                  onChange={(e) => pagination.onRowsPerPageChange(Number(e.target.value))}
                >
                  {(pagination.rowsPerPageOptions ?? getRowsPerPageOptions()).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span
                  className={classes.paginationSelectIcon}
                  style={{
                    color: themeColors.formFooter?.back?.backgroundColor ?? themeColors.fontColor,
                  }}
                >
                  <ChevronIcon width={18} height={18} />
                </span>
              </div>

              <GluuText variant="span" disableThemeColor>
                {pagination.totalItems === 0
                  ? `0-0 ${t(T_KEYS.FIELDS_OF)} 0`
                  : `${pagination.page * pagination.rowsPerPage + 1}-${Math.min((pagination.page + 1) * pagination.rowsPerPage, pagination.totalItems)} ${t(T_KEYS.FIELDS_OF)} ${pagination.totalItems}`}
              </GluuText>

              <div className={classes.paginationNav}>
                <GluuButton
                  type="button"
                  className={`${classes.paginationButton} ${isFirstPage ? classes.paginationButtonDisabled : ''}`}
                  disabled={isFirstPage}
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  title={t(T_KEYS.MESSAGES_PREVIOUS_PAGE)}
                  backgroundColor="transparent"
                  borderColor="transparent"
                  textColor={
                    isFirstPage
                      ? themeColors.textMuted
                      : (themeColors.formFooter?.back?.backgroundColor ?? themeColors.fontColor)
                  }
                  minHeight={40}
                >
                  <ChevronIcon width={20} height={20} direction="left" />
                </GluuButton>
                <GluuButton
                  type="button"
                  className={`${classes.paginationButton} ${isLastPage ? classes.paginationButtonDisabled : ''}`}
                  disabled={isLastPage}
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  title={t(T_KEYS.MESSAGES_NEXT_PAGE)}
                  backgroundColor="transparent"
                  borderColor="transparent"
                  textColor={
                    isLastPage
                      ? themeColors.textMuted
                      : (themeColors.formFooter?.back?.backgroundColor ?? themeColors.fontColor)
                  }
                  minHeight={40}
                >
                  <ChevronIcon width={20} height={20} direction="right" />
                </GluuButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(GluuTable) as typeof GluuTable
