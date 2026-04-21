import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { createDate, subtractDate, isValidDate, DATE_FORMATS } from '@/utils/dayjsUtils'
import type { Dayjs } from '@/utils/dayjsUtils'
import SearchIcon from '@mui/icons-material/Search'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import { GluuBadge } from '@/components/GluuBadge'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import SetTitle from 'Utils/SetTitle'
import { useStyles } from './AuditListPage.style'
import { auditListTimestampRegex, hasBothDates } from 'Plugins/admin/helper/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAuditData, getGetAuditDataQueryKey, GetAuditDataParams } from 'JansConfigApi'
import type { AuditRow } from './types'
import {
  getDefaultPagingSize,
  getRowsPerPageOptions,
  usePaginationState,
} from '@/utils/pagingUtils'

const AUDIT_LOGS_RESOURCE_ID = ADMIN_UI_RESOURCES.AuditLogs
const AUDIT_LOGS_SCOPES = CEDAR_RESOURCE_SCOPES[AUDIT_LOGS_RESOURCE_ID] ?? []

const T_KEYS = {
  TITLE_AUDIT_LOGS: 'titles.audit_logs',
  FIELD_LOG_ENTRY: 'fields.log_entry',
  ACTION_SEARCH: 'actions.search',
  MSG_ERROR_LOADING: 'messages.error_loading_data',
  MSG_NO_DATA: 'messages.no_data',
  PLACEHOLDER_SEARCH_PATTERN: 'placeholders.search_pattern',
} as const

const splitTimestamp = (timestamp: string): { datePart: string; timePart: string } => {
  if (!timestamp) return { datePart: '', timePart: '' }
  const spaceIdx = timestamp.indexOf(' ')
  if (spaceIdx === -1) return { datePart: timestamp, timePart: '' }
  return {
    datePart: timestamp.slice(0, spaceIdx),
    timePart: timestamp.slice(spaceIdx + 1),
  }
}

const AuditListPage: React.FC = () => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ isDark, themeColors })
  const { hasCedarReadPermission, authorizeHelper } = useCedarling()

  SetTitle(t(T_KEYS.TITLE_AUDIT_LOGS))

  const canReadAuditLogs = useMemo(
    () => hasCedarReadPermission(AUDIT_LOGS_RESOURCE_ID),
    [hasCedarReadPermission],
  )

  useEffect(() => {
    if (AUDIT_LOGS_SCOPES.length > 0) {
      authorizeHelper(AUDIT_LOGS_SCOPES)
    }
  }, [authorizeHelper])

  const queryClient = useQueryClient()
  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [startDate, setStartDate] = useState<Dayjs | null>(() =>
    subtractDate(createDate(), 14, 'day').startOf('day'),
  )
  const [endDate, setEndDate] = useState<Dayjs | null>(() => createDate())
  const [queryParams, setQueryParams] = useState<GetAuditDataParams>(() => {
    const start = subtractDate(createDate(), 14, 'day').startOf('day')
    const end = createDate()
    return {
      limit: getDefaultPagingSize(),
      startIndex: 0,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    }
  })

  const { data, isLoading, isFetching, isError } = useGetAuditData(queryParams, {
    query: { enabled: canReadAuditLogs },
  })
  const totalItems = useMemo(() => data?.totalEntriesCount ?? 0, [data?.totalEntriesCount])
  const entries = useMemo(() => data?.entries ?? [], [data?.entries])

  const filterState = useMemo(
    () => ({
      hasBothDates: hasBothDates(startDate, endDate),
      startDateApi: isValidDate(startDate) ? startDate!.toISOString() : '',
      endDateApi: isValidDate(endDate) ? endDate!.toISOString() : '',
    }),
    [startDate, endDate],
  )

  const buildQueryParams = useCallback(
    (
      currentLimit: number,
      currentStartIndex: number,
      currentPattern: string,
      currentFilters: typeof filterState,
    ): GetAuditDataParams => {
      const params: GetAuditDataParams = {
        limit: currentLimit,
        startIndex: currentStartIndex,
      }
      params.pattern = currentPattern.trim()
      if (currentFilters.hasBothDates) {
        params.start_date = currentFilters.startDateApi
        params.end_date = currentFilters.endDateApi
      }
      return params
    },
    [],
  )

  const patternRef = useRef(pattern)
  const filterStateRef = useRef(filterState)
  patternRef.current = pattern
  filterStateRef.current = filterState

  const handlePagingSizeSync = useCallback(
    (newSize: number) => {
      onPagingSizeSync(newSize)
      setQueryParams(buildQueryParams(newSize, 0, patternRef.current, filterStateRef.current))
    },
    [buildQueryParams, onPagingSizeSync],
  )

  const handleSearch = useCallback(
    (val: string) => {
      if (!filterStateRef.current.hasBothDates) return
      setPattern(val)
      patternRef.current = val
      setPageNumber(0)
      const nextParams = buildQueryParams(limit, 0, val, filterStateRef.current)
      setQueryParams(nextParams)
      queryClient.invalidateQueries({ queryKey: getGetAuditDataQueryKey(nextParams) })
    },
    [buildQueryParams, limit, queryClient],
  )

  const handleRefresh = useCallback(() => {
    const resetStart = subtractDate(createDate(), 14, 'day').startOf('day')
    const resetEnd = createDate()
    const resetParams = buildQueryParams(limit, 0, '', {
      hasBothDates: true,
      startDateApi: resetStart.toISOString(),
      endDateApi: resetEnd.toISOString(),
    })
    setStartDate(resetStart)
    setEndDate(resetEnd)
    setPattern('')
    setPageNumber(0)
    setQueryParams(resetParams)
    queryClient.invalidateQueries({ queryKey: getGetAuditDataQueryKey(resetParams) })
  }, [buildQueryParams, limit, queryClient])

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    setStartDate(date)
  }, [])
  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDate(date)
  }, [])

  const handleStartDateAccept = useCallback((date: Dayjs | null) => {
    setStartDate(date)
  }, [])

  const handleEndDateAccept = useCallback((date: Dayjs | null) => {
    setEndDate(date)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      setPageNumber(page)
      setQueryParams(buildQueryParams(limit, page * limit, pattern, filterState))
    },
    [buildQueryParams, limit, pattern, filterState],
  )

  const handleRowsPerPageChange = useCallback(
    (newLimit: number) => {
      setPageNumber(0)
      setLimit(newLimit)
      setQueryParams(buildQueryParams(newLimit, 0, pattern, filterState))
    },
    [buildQueryParams, pattern, filterState],
  )

  const dateBadgeColors = useMemo(
    () => ({
      backgroundColor: themeColors.formFooter?.apply?.backgroundColor,
      textColor: themeColors.formFooter?.apply?.textColor,
      borderColor: themeColors.formFooter?.apply?.borderColor,
    }),
    [themeColors],
  )

  const serialColumnWidth = useMemo(() => {
    const digitsFromTotal = String(Math.max(totalItems, 0)).length
    const digits = Math.max(digitsFromTotal, 6)
    return `${digits + 3}ch`
  }, [totalItems])

  const columns: ColumnDef<AuditRow>[] = useMemo(
    () => [
      {
        key: 'serial',
        label: '#',
        width: serialColumnWidth,
        minWidth: 48,
        align: 'left' as const,
        sortable: false,
      },
      {
        key: 'log',
        label: t(T_KEYS.FIELD_LOG_ENTRY),
        width: 'auto',
        sortable: false,
        render: (
          _value: AuditRow[keyof AuditRow],
          row: AuditRow,
          _rowIdx: number,
          context?: { isExpanded: boolean },
        ) => {
          const isExpanded = context?.isExpanded ?? false
          if (!row.timestamp) {
            return (
              <GluuText
                variant="div"
                disableThemeColor
                className={`${classes.logEntryContent} ${!isExpanded ? classes.logEntryContentCollapsed : ''}`}
              >
                {row.content}
              </GluuText>
            )
          }
          return (
            <GluuText variant="div" disableThemeColor className={classes.logEntryCell}>
              <GluuBadge
                pill
                size="md"
                backgroundColor={dateBadgeColors.backgroundColor}
                textColor={dateBadgeColors.textColor}
                borderColor={dateBadgeColors.borderColor}
                className={classes.dateBadge}
              >
                <AccessTimeIcon className={classes.accessTimeIcon} />
                {row.datePart}
              </GluuBadge>
              {row.timePart ? (
                <GluuText variant="span" disableThemeColor>
                  {row.timePart}
                </GluuText>
              ) : null}
              <GluuText
                variant="div"
                disableThemeColor
                className={`${classes.logEntryContent} ${!isExpanded ? classes.logEntryContentCollapsed : ''}`}
              >
                {row.content}
              </GluuText>
            </GluuText>
          )
        },
      },
    ],
    [
      t,
      classes.logEntryCell,
      classes.logEntryContent,
      classes.logEntryContentCollapsed,
      classes.dateBadge,
      classes.accessTimeIcon,
      dateBadgeColors,
      serialColumnWidth,
    ],
  )

  const auditRows: AuditRow[] = useMemo(() => {
    if (!entries || !Array.isArray(entries)) return []
    const startSerial = pageNumber * limit
    return entries.map((auditString: string, idx: number) => {
      const match = auditString.match(auditListTimestampRegex)
      const timestamp = match?.[1] ?? ''
      const content = match?.[2] ?? auditString
      const { datePart, timePart } = splitTimestamp(timestamp)
      return {
        id: startSerial + idx + 1,
        serial: startSerial + idx + 1,
        log: auditString,
        timestamp,
        datePart,
        timePart,
        content,
      }
    })
  }, [entries, pageNumber, limit])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: getRowsPerPageOptions(),
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [pageNumber, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const searchPrimaryAction = useMemo(
    () => ({
      label: t(T_KEYS.ACTION_SEARCH),
      icon: <SearchIcon className={classes.searchActionIcon} />,
    }),
    [t, classes.searchActionIcon],
  )

  const dateRangeConfig = useMemo(
    () => ({
      startDate,
      endDate,
      onStartDateChange: handleStartDateChange,
      onEndDateChange: handleEndDateChange,
      onStartDateAccept: handleStartDateAccept,
      onEndDateAccept: handleEndDateAccept,
      showTime: true,
      dateFormat: DATE_FORMATS.DATE_PICKER_DATETIME,
    }),
    [
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange,
      handleStartDateAccept,
      handleEndDateAccept,
    ],
  )

  const emptyMessage = useMemo(
    () => (isError ? t(T_KEYS.MSG_ERROR_LOADING) : t(T_KEYS.MSG_NO_DATA)),
    [isError, t],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadAuditLogs}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t(T_KEYS.PLACEHOLDER_SEARCH_PATTERN)}:`}
                searchPlaceholder={t(T_KEYS.PLACEHOLDER_SEARCH_PATTERN)}
                searchValue={pattern}
                onSearch={setPattern}
                onSearchSubmit={(val) => handleSearch(val)}
                dateRange={dateRangeConfig}
                onRefresh={handleRefresh}
                refreshLoading={isFetching}
                primaryAction={searchPrimaryAction}
                disabled={isFetching}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <div data-audit-table>
              <GluuTable<AuditRow>
                columns={columns}
                data={auditRows}
                loading={false}
                expandable
                expandColumnWidth={40}
                pagination={pagination}
                onPagingSizeSync={handlePagingSizeSync}
                emptyMessage={emptyMessage}
              />
            </div>
          </div>
        </GluuViewWrapper>
      </div>
    </GluuLoader>
  )
}

export default AuditListPage
