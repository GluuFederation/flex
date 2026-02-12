import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { GluuSpinner } from '@/components/GluuSpinner'
import { useStyles } from './GluuTable.style'
import type { GluuTableProps, SortDirection, ColumnKey } from './types'
import { ChevronIcon } from '@/components/SVG'
import { BORDER_RADIUS } from '@/constants'
import { getRowsPerPageOptions } from '@/utils/pagingUtils'

const T_KEYS = {
  FIELDS_ACTIONS: 'fields.actions',
  FIELDS_EXPAND_ROW: 'fields.expand_row',
  FIELDS_OF: 'fields.of',
  FIELDS_ROWS_PER_PAGE: 'fields.rows_per_page',
  MESSAGES_LOADING: 'messages.loading',
  MESSAGES_NO_DATA: 'messages.no_data_available',
  MESSAGES_COLLAPSE: 'messages.collapse',
  MESSAGES_EXPAND: 'messages.expand',
  MESSAGES_PREVIOUS_PAGE: 'messages.previous_page',
  MESSAGES_NEXT_PAGE: 'messages.next_page',
} as const

const SORT_ICON_SX = { fontSize: 12 } as const

function GluuTable<T>(props: Readonly<GluuTableProps<T>>) {
  const {
    columns,
    data,
    loading = false,
    expandable = false,
    renderExpandedRow,
    pagination,
    actions,
    sortColumn = null,
    sortDirection = null,
    onSort,
    getRowKey,
    emptyMessage,
    stickyHeader = false,
    tableClassName,
  } = props

  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors, stickyHeader })
  const expandButtonBg = themeColors.table.expandButtonBg

  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set())

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
      return index
    },
    [getRowKey],
  )

  const handleSort = useCallback(
    (columnKey: string) => {
      if (!onSort) return
      let nextDirection: SortDirection = 'asc'
      if (sortColumn === columnKey) {
        if (sortDirection === 'asc') nextDirection = 'desc'
        else if (sortDirection === 'desc') nextDirection = null
      }
      onSort(columnKey, nextDirection)
    },
    [onSort, sortColumn, sortDirection],
  )

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

  return (
    <div className={classes.root}>
      {loading && (
        <div className={classes.loadingOverlay}>
          <GluuSpinner size={32} aria-label={t(T_KEYS.MESSAGES_LOADING)} />
        </div>
      )}

      <div className={classes.wrapper}>
        <table className={[classes.table, tableClassName].filter(Boolean).join(' ')}>
          <thead>
            <tr>
              {expandable && <th className={`${classes.headerCell} ${classes.headerCellExpand}`} />}
              {columns.map((col) => {
                const isSortable = col.sortable !== false && onSort
                const isActive = sortColumn === col.key
                return (
                  <th
                    key={col.key}
                    className={classes.headerCell}
                    style={{
                      width: col.width,
                      minWidth: col.minWidth,
                      textAlign: col.align || 'left',
                    }}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        className={classes.sortableHeader}
                        onClick={() => handleSort(col.key)}
                      >
                        <GluuText variant="span" disableThemeColor>
                          {col.label}
                        </GluuText>
                        <span className={classes.sortIconWrap}>
                          <ArrowUpwardIcon
                            sx={{
                              ...SORT_ICON_SX,
                              opacity: isActive && sortDirection === 'asc' ? 1 : 0.25,
                            }}
                          />
                          <ArrowDownwardIcon
                            sx={{
                              ...SORT_ICON_SX,
                              opacity: isActive && sortDirection === 'desc' ? 1 : 0.25,
                            }}
                          />
                        </span>
                      </button>
                    ) : (
                      <GluuText variant="span" disableThemeColor>
                        {col.label}
                      </GluuText>
                    )}
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className={classes.emptyRow}>
                  <GluuText variant="span" disableThemeColor>
                    {emptyMessage ?? defaultEmptyMessage}
                  </GluuText>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const rowKey = resolveRowKey(row, rowIdx)
                const isExpanded = expandedRows.has(rowKey)
                return (
                  <React.Fragment key={rowKey}>
                    <tr
                      className={`${classes.row} ${expandable && isExpanded ? classes.rowExpanded : ''}`}
                    >
                      {expandable && (
                        <td className={`${classes.cell} ${classes.cellExpand}`}>
                          <GluuButton
                            type="button"
                            className={classes.expandButton}
                            aria-expanded={isExpanded}
                            aria-label={t(T_KEYS.FIELDS_EXPAND_ROW, {
                              defaultValue: isExpanded ? 'Collapse row' : 'Expand row',
                            })}
                            title={
                              isExpanded
                                ? t(T_KEYS.MESSAGES_COLLAPSE, { defaultValue: 'Collapse' })
                                : t(T_KEYS.MESSAGES_EXPAND, { defaultValue: 'Expand' })
                            }
                            onClick={() => toggleRow(rowKey)}
                            backgroundColor={expandButtonBg}
                            borderColor="transparent"
                            borderRadius={BORDER_RADIUS.CIRCLE}
                            textColor={themeColors.fontColor}
                            minHeight="28px"
                            padding="6px"
                            disableHoverStyles
                          >
                            <ExpandMoreIcon
                              className={`${classes.expandIcon} ${isExpanded ? classes.expandIconOpen : ''}`}
                              sx={{ fontSize: 20, color: themeColors.fontColor }}
                            />
                          </GluuButton>
                        </td>
                      )}
                      {columns.map((col, colIdx) => {
                        const key = col.key as ColumnKey<T>
                        const value = (row as T)[key]
                        const isFirstColumn = expandable && colIdx === 0
                        return (
                          <td
                            key={col.key}
                            className={`${classes.cell} ${isFirstColumn ? classes.cellFirst : ''}`}
                            style={{
                              textAlign: col.align || 'left',
                              width: col.width,
                              minWidth: col.minWidth,
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
                className={`${classes.paginationButton} ${pagination.page === 0 ? classes.paginationButtonDisabled : ''}`}
                disabled={pagination.page === 0}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                title={t(T_KEYS.MESSAGES_PREVIOUS_PAGE)}
                backgroundColor="transparent"
                borderColor="transparent"
                textColor={
                  pagination.page === 0
                    ? themeColors.textMuted
                    : (themeColors.formFooter?.back?.backgroundColor ?? themeColors.fontColor)
                }
                minHeight={40}
              >
                <ChevronIcon width={20} height={20} direction="left" />
              </GluuButton>
              <GluuButton
                type="button"
                className={`${classes.paginationButton} ${(pagination.page + 1) * pagination.rowsPerPage >= pagination.totalItems ? classes.paginationButtonDisabled : ''}`}
                disabled={(pagination.page + 1) * pagination.rowsPerPage >= pagination.totalItems}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                title={t(T_KEYS.MESSAGES_NEXT_PAGE)}
                backgroundColor="transparent"
                borderColor="transparent"
                textColor={
                  (pagination.page + 1) * pagination.rowsPerPage >= pagination.totalItems
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
  )
}

export default React.memo(GluuTable) as typeof GluuTable
