import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createDate, subtractDate, isValidDate, isAfterDate } from '@/utils/dayjsUtils'
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
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import SetTitle from 'Utils/SetTitle'
import { useStyles } from './AuditListPage.style'
import { auditListTimestampRegex, dateConverter, hasBothDates } from 'Plugins/admin/helper/utils'
import { useGetAuditData, GetAuditDataParams } from 'JansConfigApi'
import type { AuditRow } from './types'
import { getDefaultPagingSize, getRowsPerPageOptions } from '@/utils/pagingUtils'

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

const getAuditRowKey = (row: AuditRow) => row.id

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
    [hasCedarReadPermission, AUDIT_LOGS_RESOURCE_ID],
  )

  useEffect(() => {
    if (AUDIT_LOGS_SCOPES.length > 0) {
      authorizeHelper(AUDIT_LOGS_SCOPES)
    }
  }, [authorizeHelper])

  const [limit, setLimit] = useState(getDefaultPagingSize)
  const [pattern, setPattern] = useState('')
  const [pageNumber, setPageNumber] = useState(0)
  const [startDate, setStartDate] = useState<Dayjs | null>(() =>
    subtractDate(createDate(), 14, 'day'),
  )
  const [endDate, setEndDate] = useState<Dayjs | null>(() => createDate())
  const [queryParams, setQueryParams] = useState<GetAuditDataParams>(() => {
    const start = subtractDate(createDate(), 14, 'day')
    const end = createDate()
    return {
      limit: getDefaultPagingSize(),
      startIndex: 0,
      start_date: dateConverter(start),
      end_date: dateConverter(end),
    }
  })

  const { data, isLoading, isFetching, isError } = useGetAuditData(queryParams, {
    query: { enabled: canReadAuditLogs },
  })
  const loading = useMemo(() => isLoading || isFetching, [isLoading, isFetching])
  const totalItems = useMemo(() => data?.totalEntriesCount ?? 0, [data?.totalEntriesCount])
  const entries = useMemo(() => data?.entries ?? [], [data?.entries])

  const filterState = useMemo(
    () => ({
      hasBothDates: hasBothDates(startDate, endDate),
      startDateApi: isValidDate(startDate) ? dateConverter(startDate) : '',
      endDateApi: isValidDate(endDate) ? dateConverter(endDate) : '',
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
      if (currentPattern.trim()) params.pattern = currentPattern.trim()
      if (currentFilters.hasBothDates) {
        params.start_date = currentFilters.startDateApi
        params.end_date = currentFilters.endDateApi
      }
      return params
    },
    [],
  )

  const handleSearch = useCallback(() => {
    if (!filterState.hasBothDates) return
    setPageNumber(0)
    const nextParams = buildQueryParams(limit, 0, pattern, filterState)
    setQueryParams(nextParams)
  }, [buildQueryParams, limit, pattern, filterState])

  const handleRefresh = useCallback(() => {
    if (!filterState.hasBothDates) return
    setPageNumber(0)
    setPattern('')
    setQueryParams(buildQueryParams(limit, 0, '', filterState))
  }, [buildQueryParams, limit, filterState])

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    setStartDate(date)
  }, [])
  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDate(date)
  }, [])

  const refreshWithNewDates = useCallback(
    (newStartApi: string, newEndApi: string) => {
      if (!newStartApi || !newEndApi) return
      setPageNumber(0)
      setQueryParams(
        buildQueryParams(limit, 0, pattern, {
          hasBothDates: true,
          startDateApi: newStartApi,
          endDateApi: newEndApi,
        }),
      )
    },
    [buildQueryParams, limit, pattern],
  )

  const handleStartDateAccept = useCallback(
    (date: Dayjs | null) => {
      setStartDate(date)
      if (
        date &&
        endDate &&
        isValidDate(date) &&
        isValidDate(endDate) &&
        !isAfterDate(date, endDate)
      ) {
        refreshWithNewDates(dateConverter(date), dateConverter(endDate))
      }
    },
    [endDate, refreshWithNewDates],
  )
  const handleEndDateAccept = useCallback(
    (date: Dayjs | null) => {
      setEndDate(date)
      if (
        date &&
        startDate &&
        isValidDate(startDate) &&
        isValidDate(date) &&
        !isAfterDate(startDate, date)
      ) {
        refreshWithNewDates(dateConverter(startDate), dateConverter(date))
      }
    },
    [startDate, refreshWithNewDates],
  )

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

  const columns: ColumnDef<AuditRow>[] = useMemo(
    () => [
      {
        key: 'serial',
        label: '#',
        width: 60,
        align: 'left' as const,
        sortable: false,
      },
      {
        key: 'log',
        label: t(T_KEYS.FIELD_LOG_ENTRY),
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
              <div
                className={`${classes.logEntryContent} ${!isExpanded ? classes.logEntryContentCollapsed : ''}`}
              >
                {row.content}
              </div>
            )
          }
          return (
            <div className={classes.logEntryCell}>
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
              {row.timePart ? <span>{row.timePart}</span> : null}
              <div
                className={`${classes.logEntryContent} ${!isExpanded ? classes.logEntryContentCollapsed : ''}`}
              >
                {row.content}
              </div>
            </div>
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
      onClick: handleSearch,
    }),
    [t, handleSearch, classes.searchActionIcon],
  )

  const dateRangeConfig = useMemo(
    () => ({
      startDate,
      endDate,
      onStartDateChange: handleStartDateChange,
      onEndDateChange: handleEndDateChange,
      onStartDateAccept: handleStartDateAccept,
      onEndDateAccept: handleEndDateAccept,
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
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadAuditLogs}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t(T_KEYS.PLACEHOLDER_SEARCH_PATTERN)}:`}
                searchPlaceholder={t(T_KEYS.PLACEHOLDER_SEARCH_PATTERN)}
                searchValue={pattern}
                onSearch={setPattern}
                onSearchSubmit={handleSearch}
                dateRange={dateRangeConfig}
                onRefresh={handleRefresh}
                refreshLoading={loading}
                primaryAction={searchPrimaryAction}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            {/* loading={false}: page-level GluuLoader already shows blocking overlay; table loading state intentionally suppressed */}
            <GluuTable<AuditRow>
              columns={columns}
              data={auditRows}
              loading={false}
              expandable
              pagination={pagination}
              getRowKey={getAuditRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>
      </div>
    </GluuLoader>
  )
}

export default AuditListPage
