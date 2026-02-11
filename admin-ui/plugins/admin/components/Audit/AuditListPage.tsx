import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createDate,
  formatDate,
  subtractDate,
  isValidDate,
  isAfterDate,
  DATE_FORMATS,
} from '@/utils/dayjsUtils'
import type { Dayjs } from '@/utils/dayjsUtils'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import SetTitle from 'Utils/SetTitle'
import { useStyles } from './AuditListPage.style'
import { auditListTimestampRegex, dateConverter, hasBothDates } from 'Plugins/admin/helper/utils'
import { useGetAuditData, GetAuditDataParams } from 'JansConfigApi'
import type { AuditRow } from './types'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const AUDIT_LOGS_RESOURCE_ID = ADMIN_UI_RESOURCES.AuditLogs
const AUDIT_LOGS_SCOPES = CEDAR_RESOURCE_SCOPES[AUDIT_LOGS_RESOURCE_ID] ?? []

const SEARCH_ACTION_ICON = <SearchIcon sx={{ fontSize: 20 }} />

const toDayjsDate = (isoStr: string): Dayjs | null => {
  if (!isoStr) return null
  const d = createDate(isoStr)
  return isValidDate(d) ? d : null
}

const toIsoDate = (d: Dayjs | null): string => {
  if (!d) return ''
  return formatDate(d, DATE_FORMATS.DATE_ONLY)
}

const getAuditRowKey = (row: AuditRow) => row.id

const getLogDisplayText = (row: AuditRow): string => {
  if (!row.timestamp) return row.content
  return `${row.timestamp}     ${row.content}`
}

const initialStartDate = subtractDate(createDate(), 14, 'day')
const initialEndDate = createDate()

const AuditListPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('menus.audit_logs'))

  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ isDark, themeColors })

  const { hasCedarReadPermission, authorizeHelper } = useCedarling()
  const canReadAuditLogs = useMemo(
    () => hasCedarReadPermission(AUDIT_LOGS_RESOURCE_ID),
    [hasCedarReadPermission],
  )

  useEffect(() => {
    if (AUDIT_LOGS_SCOPES.length > 0) {
      authorizeHelper(AUDIT_LOGS_SCOPES)
    }
  }, [authorizeHelper])

  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState('')
  const [pageNumber, setPageNumber] = useState(0)
  const [startDateStr, setStartDateStr] = useState(() => toIsoDate(initialStartDate))
  const [endDateStr, setEndDateStr] = useState(() => toIsoDate(initialEndDate))
  const [queryParams, setQueryParams] = useState<GetAuditDataParams>(() => ({
    limit: 10,
    startIndex: 0,
    start_date: dateConverter(initialStartDate),
    end_date: dateConverter(initialEndDate),
  }))

  const { data, isLoading, isFetching, isError } = useGetAuditData(queryParams, {
    query: { enabled: canReadAuditLogs },
  })

  const loading = isLoading || isFetching

  const totalItems = data?.totalEntriesCount ?? 0
  const entries = data?.entries ?? []

  const startDate = useMemo(() => toDayjsDate(startDateStr), [startDateStr])
  const endDate = useMemo(() => toDayjsDate(endDateStr), [endDateStr])

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
    setStartDateStr(toIsoDate(date))
  }, [])
  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDateStr(toIsoDate(date))
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
      setStartDateStr(toIsoDate(date))
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
      setEndDateStr(toIsoDate(date))
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
        label: t('fields.log_entry'),
        sortable: false,
        render: (_value: AuditRow[keyof AuditRow], row: AuditRow) => getLogDisplayText(row),
      },
    ],
    [t],
  )

  const auditRows: AuditRow[] = useMemo(() => {
    if (!entries || !Array.isArray(entries)) return []
    const startSerial = pageNumber * limit
    return entries.map((auditString: string, idx: number) => {
      const match = auditString.match(auditListTimestampRegex)
      const timestamp = match?.[1] ?? ''
      const content = match?.[2] ?? auditString
      return {
        id: startSerial + idx + 1,
        serial: startSerial + idx + 1,
        log: auditString,
        timestamp,
        content,
      }
    })
  }, [entries, pageNumber, limit])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: PAGE_SIZE_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [pageNumber, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const searchPrimaryAction = useMemo(
    () => ({
      label: t('actions.search'),
      icon: SEARCH_ACTION_ICON,
      onClick: handleSearch,
    }),
    [t, handleSearch],
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

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadAuditLogs}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t('placeholders.search_pattern')}:`}
                searchPlaceholder={t('placeholders.search_pattern')}
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
            <GluuTable<AuditRow>
              columns={columns}
              data={auditRows}
              loading={false}
              pagination={pagination}
              getRowKey={getAuditRowKey}
              emptyMessage={isError ? t('messages.error_loading_data') : t('messages.no_data')}
            />
          </div>
        </GluuViewWrapper>
      </div>
    </GluuLoader>
  )
}

export default AuditListPage
