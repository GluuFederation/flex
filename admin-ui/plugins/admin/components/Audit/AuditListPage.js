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
// import { getAuditLogs } from 'Plugins/admin/redux/features/auditSlice' // Not used

function AuditListPage() {
  const { audits, loading } = useSelector((state) => state.auditReducer)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pageSize = Number(localStorage.getItem('paggingSize')) || 10
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState('')
  const [startIndex, setStartIndex] = useState(0)
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'))
  const [endDate, setEndDate] = useState(dayjs())
  const userAction = {}

  SetTitle(t('menus.audit_logs'))

  const tableColumns = [
    { title: 'ID', field: 'id' },
    { title: 'User', field: 'user' },
    { title: 'Action', field: 'action' },
    { title: 'Timestamp', field: 'timestamp' },
  ]
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

  const handleViewClick = () => {
    const hasPattern = !!pattern
    const hasBothDates = startDate && endDate
    const hasOnlyOneDate = (startDate && !endDate) || (!startDate && endDate)
    if (!hasPattern && !hasBothDates) return
    if (hasOnlyOneDate) return
    setStartIndex(0)
    const params = { limit, startIndex: 0 }
    if (hasPattern) params.pattern = pattern
    if (hasBothDates) {
      params.startDate = startDate.format('YYYY-MM-DD')
      params.endDate = endDate.format('YYYY-MM-DD')
    }
    fetchAuditInfo(params)
  }

  function fetchAuditInfo(opts) {
    buildPayload(userAction, 'GET Audit Logs', opts)
    dispatch({ type: 'audit/getAuditLogs', payload: opts })
  }

  useEffect(() => {
    fetchAuditInfo({ limit, startIndex })
  }, [limit, startIndex])

  const isViewDisabled =
    (!pattern && !(startDate && endDate)) || (startDate && !endDate) || (!startDate && endDate)

  return (
    <>
      {/* Removed custom GlobalStyles for DatePicker transparency and box shadow */}
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={updatedColumns}
            data={audits.filter(
              (row) =>
                !pattern ||
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
                        format="YYYY-MM-DD"
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
                        format="YYYY-MM-DD"
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
    </>
  )
}

export default AuditListPage
