import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MaterialTable from '@material-table/core'
import { Paper, Button } from '@mui/material'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { LIMIT_ID, PATTERN_ID } from 'Plugins/admin/common/Constants'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { buildPayload } from '@/utils/PermChecker'
import {
  dateConverter,
  hasBothDates,
  hasOnlyOneDate,
  hasValue,
  isStartAfterEnd,
} from 'Plugins/admin/helper/utils'

const AuditListPage = () => {
  const { audits, loading } = useSelector((state) => state.auditReducer)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  SetTitle(t('menus.audit_logs'))

  const pageSize = Number(localStorage.getItem('paggingSize')) || 10
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState('')
  const [startIndex, setStartIndex] = useState(0)
  const [startDate, setStartDate] = useState(dayjs().subtract(14, 'day'))
  const [endDate, setEndDate] = useState(dayjs())
  const [tableColumns] = useState([
    { title: 'ID', field: 'id' },
    { title: 'User', field: 'user' },
    { title: 'Action', field: 'action' },
    { title: 'Timestamp', field: 'timestamp' },
  ])
  const userAction = {}

  const updatedColumns = useMemo(() => tableColumns, [tableColumns])

  const handleOptionsChange = useCallback((event) => {
    if (event.target.name === 'limit') {
      setLimit(Number(event.target.value))
      setStartIndex(0)
    } else if (event.target.name === 'pattern') {
      setPattern(event.target.value)
      setStartIndex(0)
    }
  }, [])

  const filters = useMemo(
    () => ({
      hasPattern: hasValue(pattern),
      hasBothDates: hasBothDates(startDate, endDate),
      hasOnlyOneDate: hasOnlyOneDate(startDate, endDate),
      isStartAfterEnd: isStartAfterEnd(startDate, endDate),
      startDateStr: dateConverter(startDate),
      endDateStr: dateConverter(endDate),
    }),
    [pattern, startDate, endDate],
  )

  const isViewDisabled = useMemo(() => {
    return (
      (!filters.hasPattern && !filters.hasBothDates) ||
      filters.hasOnlyOneDate ||
      filters.isStartAfterEnd
    )
  }, [filters])

  const handleViewClick = () => {
    if (isViewDisabled) return
    setStartIndex(0)
    const params = { limit, startIndex: 0 }
    if (filters.hasPattern) params.pattern = pattern
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

  useEffect(() => {
    if (filters.hasBothDates) {
      fetchAuditInfo({
        limit,
        startIndex,
        startDate: filters.startDateStr,
        endDate: filters.endDateStr,
      })
    }
  }, [filters.hasBothDates, filters.startDateStr, filters.endDateStr, limit, startIndex])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <MaterialTable
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          columns={updatedColumns}
          data={audits.filter(
            (row) =>
              !filters.hasPattern ||
              Object.values(row).join(' ').toLowerCase().includes(pattern.toLowerCase()),
          )}
          isLoading={loading}
          title=""
          actions={[
            {
              icon: () => (
                <GluuAdvancedSearch
                  limitId={LIMIT_ID}
                  patternId={PATTERN_ID}
                  limit={limit}
                  pattern={pattern}
                  handler={handleOptionsChange}
                  showLimit={false}
                />
              ),
              tooltip: t('messages.advanced_search'),
              isFreeAction: true,
              onClick: () => {},
            },
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="MM/DD/YYYY"
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
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="MM/DD/YYYY"
                      label={t('dashboard.end_date')}
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
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
              tooltip: 'Date Range Search',
              isFreeAction: true,
              onClick: () => {},
            },
          ]}
          options={useMemo(
            () => ({
              idSynonym: 'username',
              columnsButton: false,
              search: false,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }),
            [pageSize, bgThemeColor],
          )}
        />
      </CardBody>
    </Card>
  )
}

export default AuditListPage
