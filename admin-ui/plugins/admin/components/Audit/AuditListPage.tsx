import React, { useState, useMemo, useContext, useCallback } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Skeleton,
  TablePagination,
  InputAdornment,
  Tooltip,
  keyframes,
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  Article as ArticleIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material'
import MaterialTable, { Column } from '@material-table/core'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { customColors } from '@/customColors'
import SetTitle from 'Utils/SetTitle'
import {
  auditListTimestampRegex,
  dateConverter,
  hasBothDates,
  hasOnlyOneDate,
  isStartAfterEnd,
  isValidDate,
} from 'Plugins/admin/helper/utils'
import { useGetAuditData, GetAuditDataParams } from 'JansConfigApi'
import { AuditRow, AuditSearchProps } from './types'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const STYLES = {
  container: {
    minHeight: '70vh',
    p: 3,
  },
  filterBox: {
    mb: 3,
    p: 2.5,
    borderRadius: 2,
  },
  filterRow: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchField: {
    'minWidth': 280,
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
    },
  },
  datePicker: {
    'minWidth': 160,
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
    },
  },
  tableContainer: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 10,
    px: 4,
  },
  logEntry: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
    py: 0.5,
  },
  logContent: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    wordBreak: 'break-word' as const,
  },
} as const

const LoadingSkeleton: React.FC = () => (
  <Box p={2}>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <Box key={i} display="flex" alignItems="center" gap={2} mb={1.5}>
        <Skeleton variant="rounded" width={40} height={32} />
        <Skeleton variant="rounded" width={100} height={28} sx={{ borderRadius: 3 }} />
        <Skeleton variant="text" sx={{ flex: 1 }} height={24} />
      </Box>
    ))}
  </Box>
)

const EmptyState: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box sx={STYLES.emptyState}>
      <ArticleIcon sx={{ fontSize: 64, color: customColors.lightGray, mb: 2 }} />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {t('messages.no_data')}
      </Typography>
      <Typography variant="body2" color="textSecondary" textAlign="center">
        {t('messages.adjust_filters')}
      </Typography>
    </Box>
  )
}

interface ErrorStateProps {
  onRetry: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  const { t } = useTranslation()
  return (
    <Box sx={STYLES.emptyState}>
      <ErrorOutlineIcon sx={{ fontSize: 64, color: customColors.accentRed, mb: 2 }} />
      <Typography variant="h6" color="error" gutterBottom>
        {t('messages.error_loading_data')}
      </Typography>
      <Typography variant="body2" color="textSecondary" textAlign="center" mb={2}>
        {t('messages.try_again_later')}
      </Typography>
      <Button variant="outlined" color="error" onClick={onRetry} startIcon={<RefreshIcon />}>
        {t('actions.retry')}
      </Button>
    </Box>
  )
}

const AuditSearch: React.FC<AuditSearchProps> = ({
  pattern,
  startDate,
  endDate,
  isLoading,
  onPatternChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onRefresh,
  isSearchDisabled,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlack'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isSearchDisabled) {
        onSearch()
      }
    },
    [isSearchDisabled, onSearch],
  )

  return (
    <Paper
      elevation={0}
      sx={{
        ...STYLES.filterBox,
        backgroundColor: customColors.white,
        border: `1px solid ${customColors.lightGray}`,
      }}
    >
      <Box sx={STYLES.filterRow}>
        <TextField
          size="small"
          label={t('placeholders.search_pattern')}
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={STYLES.searchField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: customColors.lightGray }} />
              </InputAdornment>
            ),
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={t('dashboard.start_date')}
            value={startDate}
            onChange={onStartDateChange}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: STYLES.datePicker,
              },
            }}
          />
          <DatePicker
            label={t('dashboard.end_date')}
            value={endDate}
            onChange={onEndDateChange}
            format="DD/MM/YYYY"
            maxDate={dayjs()}
            slotProps={{
              textField: {
                size: 'small',
                sx: STYLES.datePicker,
              },
            }}
          />
        </LocalizationProvider>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Tooltip title={t('actions.refresh')}>
            <IconButton
              onClick={onRefresh}
              disabled={isLoading}
              sx={{
                'backgroundColor': customColors.lightGray,
                '&:hover': { backgroundColor: customColors.lightGray, opacity: 0.8 },
              }}
            >
              <RefreshIcon
                sx={{
                  animation: isLoading ? `${spin} 1s linear infinite` : 'none',
                }}
              />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            onClick={onSearch}
            disabled={isSearchDisabled || isLoading}
            startIcon={<SearchIcon />}
            sx={{
              'px': 3,
              'borderRadius': 1.5,
              'backgroundColor': themeColors.background,
              '&:hover': { backgroundColor: themeColors.background, opacity: 0.9 },
              'textTransform': 'none',
              'fontWeight': 600,
            }}
          >
            {t('actions.search')}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

const AuditListPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('menus.audit_logs'))

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlack'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [limit, setLimit] = useState<number>(10)
  const [pattern, setPattern] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(14, 'day'))
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())
  const [queryParams, setQueryParams] = useState<GetAuditDataParams>(() => ({
    limit: 10,
    startIndex: 0,
    start_date: dateConverter(dayjs().subtract(14, 'day')),
    end_date: dateConverter(dayjs()),
  }))

  const { data, isLoading, isError, refetch } = useGetAuditData(queryParams)

  const totalItems = data?.totalEntriesCount ?? 0
  const entries = data?.entries ?? []

  const filters = useMemo(
    () => ({
      hasBothDates: hasBothDates(startDate, endDate),
      hasOnlyOneDate: hasOnlyOneDate(startDate, endDate),
      isStartAfterEnd: isStartAfterEnd(startDate, endDate),
      startDateStr: isValidDate(startDate) ? dateConverter(startDate) : '',
      endDateStr: isValidDate(endDate) ? dateConverter(endDate) : '',
    }),
    [startDate, endDate],
  )

  const isSearchDisabled = useMemo(() => {
    if (filters.isStartAfterEnd) return true
    if (filters.hasOnlyOneDate) return true
    if (pattern.trim() && !startDate && !endDate) return false
    if (filters.hasBothDates) return false
    return true
  }, [filters, pattern, startDate, endDate])

  const buildQueryParams = useCallback(
    (
      currentLimit: number,
      currentStartIndex: number,
      currentPattern: string,
      currentFilters: typeof filters,
    ): GetAuditDataParams => {
      const params: GetAuditDataParams = {
        limit: currentLimit,
        startIndex: currentStartIndex,
      }
      if (currentPattern.trim()) params.pattern = currentPattern.trim()
      if (currentFilters.hasBothDates) {
        params.start_date = currentFilters.startDateStr
        params.end_date = currentFilters.endDateStr
      }
      return params
    },
    [],
  )

  const handleSearch = useCallback(() => {
    if (isSearchDisabled) return
    setPageNumber(0)
    setQueryParams(buildQueryParams(limit, 0, pattern, filters))
  }, [isSearchDisabled, buildQueryParams, limit, pattern, filters])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const onPageChange = useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      setPageNumber(page)
      setQueryParams(buildQueryParams(limit, page * limit, pattern, filters))
    },
    [buildQueryParams, limit, pattern, filters],
  )

  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newLimit = parseInt(event.target.value, 10)
      setPageNumber(0)
      setLimit(newLimit)
      setQueryParams(buildQueryParams(newLimit, 0, pattern, filters))
    },
    [buildQueryParams, pattern, filters],
  )

  const tableColumns: Column<AuditRow>[] = useMemo(
    () => [
      {
        title: '#',
        field: 'serial',
        width: 60,
        cellStyle: {
          width: 60,
          padding: '12px 16px',
          textAlign: 'center' as const,
          fontWeight: 500,
          color: customColors.darkGray,
        },
        headerStyle: {
          width: 60,
          textAlign: 'center' as const,
        },
        render: (rowData: AuditRow) => (
          <Typography variant="body2" fontWeight={500} color="textSecondary">
            {rowData.serial}
          </Typography>
        ),
      },
      {
        title: t('fields.log_entry'),
        field: 'log',
        cellStyle: {
          padding: '12px 16px',
        },
        render: (rowData: AuditRow) => {
          const { timestamp, content } = rowData

          if (timestamp) {
            const dateOnly = timestamp.split(' ')[0] || timestamp
            const timeOnly = timestamp.split(' ')[1] || ''

            return (
              <Box sx={STYLES.logEntry}>
                <Chip
                  icon={<ScheduleIcon sx={{ fontSize: 14 }} />}
                  label={dateOnly}
                  size="small"
                  sx={{
                    'backgroundColor': themeColors.background,
                    'color': customColors.white,
                    'fontWeight': 600,
                    'fontSize': '0.75rem',
                    '& .MuiChip-icon': { color: customColors.white },
                  }}
                />
                {timeOnly && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#000000 !important',
                      fontFamily: 'monospace',
                      minWidth: 90,
                    }}
                  >
                    {timeOnly}
                  </Typography>
                )}
                <Typography sx={{ ...STYLES.logContent, color: '#000000 !important' }}>
                  {content}
                </Typography>
              </Box>
            )
          }

          return (
            <Typography sx={{ ...STYLES.logContent, color: '#000000 !important' }}>
              {content}
            </Typography>
          )
        },
      },
    ],
    [t, themeColors.background],
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

  const renderTable = () => {
    if (isLoading) return <LoadingSkeleton />
    if (isError) return <ErrorState onRetry={refetch} />
    if (!auditRows.length) return <EmptyState />

    return (
      <MaterialTable<AuditRow>
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Pagination: () => (
            <TablePagination
              component="div"
              count={totalItems}
              page={pageNumber}
              onPageChange={onPageChange}
              rowsPerPage={limit}
              onRowsPerPageChange={onRowsPerPageChange}
              rowsPerPageOptions={PAGE_SIZE_OPTIONS}
              sx={{
                'borderTop': `1px solid ${customColors.lightGray}`,
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontWeight: 500,
                },
              }}
            />
          ),
        }}
        columns={tableColumns}
        data={auditRows}
        title=""
        options={{
          toolbar: false,
          search: false,
          selection: false,
          paging: true,
          pageSize: limit,
          draggable: false,
          sorting: false,
          headerStyle: {
            backgroundColor: themeColors.background,
            color: customColors.white,
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase' as const,
            padding: '14px 16px',
          },
          rowStyle: (_: AuditRow, index: number) => ({
            backgroundColor: index % 2 === 0 ? customColors.white : themeColors.lightBackground,
          }),
        }}
      />
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{ ...STYLES.container, backgroundColor: customColors.white, borderRadius: 3 }}
    >
      <Box mb={3}>
        <Typography variant="h5" fontWeight={600} color={customColors.darkGray} gutterBottom>
          {t('menus.audit_logs')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t('messages.audit_description')}
        </Typography>
      </Box>

      <AuditSearch
        pattern={pattern}
        startDate={startDate}
        endDate={endDate}
        isLoading={isLoading}
        onPatternChange={setPattern}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        isSearchDisabled={isSearchDisabled}
      />

      {filters.isStartAfterEnd && (
        <Box mb={2}>
          <Typography color="error" variant="body2">
            {t('messages.start_date_after_end')}
          </Typography>
        </Box>
      )}

      {filters.hasOnlyOneDate && (
        <Box mb={2}>
          <Typography color="warning.main" variant="body2">
            {t('messages.both_dates_required')}
          </Typography>
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{ ...STYLES.tableContainer, border: `1px solid ${customColors.lightGray}` }}
      >
        {renderTable()}
      </Paper>

      {!isLoading && !isError && auditRows.length > 0 && (
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            {t('messages.showing_entries', {
              start: pageNumber * limit + 1,
              end: Math.min((pageNumber + 1) * limit, totalItems),
              total: totalItems,
            })}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default AuditListPage
