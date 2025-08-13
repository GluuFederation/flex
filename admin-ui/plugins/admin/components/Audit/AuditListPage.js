import React, {
  useState,
  useMemo,
  useContext,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react'
import { Badge } from 'reactstrap'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MaterialTable from '@material-table/core'
import { Paper, Button, TablePagination } from '@mui/material'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { LIMIT_ID, AUDIT_PATTERN_ID } from 'Plugins/admin/common/Constants'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { buildPayload } from '@/utils/PermChecker'
import {
  auditListTimestampRegex,
  clearInputById,
  dateConverter,
  hasBothDates,
  hasOnlyOneDate,
  isStartAfterEnd,
  isValidDate,
} from 'Plugins/admin/helper/utils'

const AuditListPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  SetTitle(t('menus.audit_logs'))

  // Get audit data from Redux
  const auditData = useSelector((state) => state.auditReducer)
  const totalItems = auditData?.totalEntriesCount || 0

  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  // Memoize theme calculations to prevent recalculation on every render
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const bgThemeColor = useMemo(
    () => ({ background: themeColors.background }),
    [themeColors.background],
  )
  const badgeColor = useMemo(() => `primary-${selectedTheme}`, [selectedTheme])

  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [startDate, setStartDate] = useState(dayjs().subtract(14, 'day'))
  const [endDate, setEndDate] = useState(dayjs())

  // Helper function to get current pattern from DOM
  const getCurrentPattern = useCallback(() => {
    return document.getElementById(AUDIT_PATTERN_ID)?.value?.trim() || ''
  }, [])

  const tableColumns = useMemo(
    () => [
      {
        title: 'Sr No.',
        field: 'serial',
        render: (rowData) => rowData.serial,
        width: 60,
        cellStyle: { width: 60, padding: '0 8px', textAlign: 'left' },
        headerStyle: {
          width: 120,
          padding: '0 8px',
          textAlign: 'left',
          whiteSpace: 'nowrap',
        },
      },
      {
        title: 'Log',
        field: 'log',
        render: (rowData) => {
          const log = rowData.log || ''
          const match = log.match(auditListTimestampRegex)

          if (match) {
            const timestamp = match[1]
            const content = match[2]

            // Extract only date portion from timestamp (DD-MM-YYYY)
            const dateOnly = timestamp.split(' ')[0] || timestamp

            return (
              <div style={{ fontSize: 13, lineHeight: 1.4, display: 'flex', alignItems: 'center' }}>
                <Badge
                  color={badgeColor}
                  pill
                  style={{ marginRight: 8, fontSize: 11, fontWeight: 600 }}
                >
                  {dateOnly}
                </Badge>
                <span style={{ fontSize: 12 }}>{content}</span>
              </div>
            )
          } else {
            return <span style={{ fontSize: 13 }}>{log}</span>
          }
        },
      },
    ],
    [badgeColor],
  )

  useLayoutEffect(() => {
    return () => {
      clearInputById(AUDIT_PATTERN_ID)
    }
  }, [])

  const userAction = {}

  const handleOptionsChange = useCallback((event) => {
    if (event.target.name === 'limit') {
      setLimit(Number(event.target.value))
    }
  }, [])

  const filters = useMemo(
    () => ({
      hasPattern: pattern && pattern.trim() !== '',
      hasBothDates: hasBothDates(startDate, endDate),
      hasOnlyOneDate: hasOnlyOneDate(startDate, endDate),
      isStartAfterEnd: isStartAfterEnd(startDate, endDate),
      startDateStr: isValidDate(startDate) ? dateConverter(startDate) : '',
      endDateStr: isValidDate(endDate) ? dateConverter(endDate) : '',
    }),
    [pattern, startDate, endDate],
  )

  const isViewDisabled = useMemo(() => {
    // Disable if start date is after end date
    if (filters.isStartAfterEnd) return true
    if (filters.hasOnlyOneDate) return true
    if (filters.hasPattern && !startDate && !endDate) return false
    if (filters.hasBothDates) return false
    return true
  }, [filters, startDate, endDate])

  const handleViewClick = () => {
    if (isViewDisabled) return
    setPageNumber(0)
    const currentPattern = getCurrentPattern()
    setPattern(currentPattern)
    const params = { limit: Number(limit), startIndex: 0 }
    if (currentPattern !== '') params.pattern = currentPattern
    if (filters.hasBothDates) {
      params.startDate = filters.startDateStr
      params.endDate = filters.endDateStr
    }

    fetchAuditInfo(params)
  }

  const fetchAuditInfo = (opts) => {
    buildPayload(userAction, 'GET Audit Logs', opts)
    dispatch({ type: 'audit/getAuditLogs', payload: opts })
  }

  // Pagination handlers
  const onPageChangeClick = useCallback(
    (page) => {
      const startCount = page * limit
      const params = {
        limit: Number(limit),
        startIndex: startCount,
      }
      const currentPattern = getCurrentPattern()
      if (currentPattern !== '') params.pattern = currentPattern
      if (filters.hasBothDates) {
        params.startDate = filters.startDateStr
        params.endDate = filters.endDateStr
      }

      setPageNumber(page)
      buildPayload(userAction, 'GET Audit Logs', params)
      dispatch({ type: 'audit/getAuditLogs', payload: params })
    },
    [limit, filters, userAction, dispatch, getCurrentPattern],
  )

  const onRowCountChangeClick = useCallback(
    (count) => {
      const params = {
        limit: Number(count),
        startIndex: 0,
      }

      const currentPattern = getCurrentPattern()
      if (currentPattern !== '') params.pattern = currentPattern
      if (filters.hasBothDates) {
        params.startDate = filters.startDateStr
        params.endDate = filters.endDateStr
      }

      setPageNumber(0)
      setLimit(count)
      buildPayload(userAction, 'GET Audit Logs', params)
      dispatch({ type: 'audit/getAuditLogs', payload: params })
    },
    [filters, userAction, dispatch, getCurrentPattern],
  )

  const auditRows = useMemo(() => {
    let items = null
    if (auditData?.entries) {
      items = auditData.entries
    } else if (auditData?.audits) {
      items = auditData.audits
    }

    if (!items || !Array.isArray(items)) {
      return []
    }

    const rows = items.map((auditString, idx) => {
      return {
        id: idx + 1,
        serial: idx + 1,
        log: auditString,
      }
    })

    return rows
  }, [auditData])

  useEffect(() => {
    const params = { limit: Number(limit), startIndex: 0 }

    fetchAuditInfo(params)
  }, [])

  useEffect(() => {
    if (auditData?.error) {
      console.error(auditData?.error)
    }
  }, [auditData])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <MaterialTable
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
            Pagination: () => (
              <TablePagination
                count={totalItems}
                page={pageNumber}
                onPageChange={(event, page) => {
                  onPageChangeClick(page)
                }}
                rowsPerPage={limit}
                onRowsPerPageChange={(event) =>
                  onRowCountChangeClick(parseInt(event.target.value, 10))
                }
              />
            ),
          }}
          columns={tableColumns}
          data={auditRows}
          isLoading={auditData?.loading || false}
          title=""
          actions={[
            {
              icon: () => (
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    background: 'transparent',
                    pointerEvents: 'auto',
                  }}
                >
                  <GluuAdvancedSearch
                    limitId={LIMIT_ID}
                    patternId={AUDIT_PATTERN_ID}
                    limit={limit}
                    pattern={pattern}
                    handler={handleOptionsChange}
                    showLimit={false}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      label={t('dashboard.start_date')}
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      slotProps={{
                        textField: {
                          sx: {
                            minWidth: 120,
                            maxWidth: 180,
                          },
                        },
                      }}
                    />
                    <DatePicker
                      format="DD/MM/YYYY"
                      label={t('dashboard.end_date')}
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                      maxDate={dayjs()}
                      slotProps={{
                        textField: {
                          sx: {
                            minWidth: 120,
                            maxWidth: 180,
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      height: 52,
                      minWidth: 90,
                      fontSize: 16,
                      fontWeight: 600,
                      py: 1.5,
                    }}
                    onClick={handleViewClick}
                    disabled={isViewDisabled}
                  >
                    <i className="fa fa-search" style={{ marginRight: 6 }}></i>
                    {t('actions.view')}
                  </Button>
                </div>
              ),
              tooltip: t('messages.advanced_search'),
              isFreeAction: true,
              onClick: () => {},
            },
          ]}
          options={useMemo(
            () => ({
              columnsButton: false,
              search: false,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }),
            [limit, bgThemeColor],
          )}
        />
      </CardBody>
    </Card>
  )
}

export default AuditListPage
