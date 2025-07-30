import React, { useState, useMemo, useContext, useCallback, useLayoutEffect } from 'react'
import { Badge } from 'reactstrap'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MaterialTable from '@material-table/core'
import { Paper, Button } from '@mui/material'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { LIMIT_ID, AUDIT_PATTERN_ID } from 'Plugins/admin/common/Constants'
import { useDispatch } from 'react-redux'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { buildPayload } from '@/utils/PermChecker'
import { clearInputById } from 'Plugins/admin/helper/utils'

const AuditListPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  SetTitle(t('menus.audit_logs'))

  const pageSize = Number(localStorage.getItem('paggingSize')) || 10
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const [limit, setLimit] = useState(10)
  const [pattern] = useState('') // Keep this for now
  const [, setStartIndex] = useState(0)
  const [startDate, setStartDate] = useState(dayjs().subtract(14, 'day'))
  const [endDate, setEndDate] = useState(dayjs())

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
          const match = log.match(/^(\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) (\w+) (.+)$/)
          let date = '',
            type = '',
            content = log
          if (match) {
            date = match[1]
            type = match[2]
            content = match[3]
          }
          return (
            <span>
              {date ? (
                <Badge
                  color={`primary-${selectedTheme}`}
                  pill
                  style={{ marginRight: 8, fontSize: 13, fontWeight: 600 }}
                >
                  {date}
                </Badge>
              ) : null}
              {type ? (
                <Badge
                  color="success"
                  pill
                  style={{ marginRight: 8, fontSize: 13, fontWeight: 600 }}
                >
                  {type}
                </Badge>
              ) : null}
              <span style={{ fontSize: 13 }}>{content}</span>
            </span>
          )
        },
      },
    ],
    [selectedTheme],
  )

  useLayoutEffect(() => {
    return () => {
      clearInputById(AUDIT_PATTERN_ID)
    }
  }, [])

  const userAction = {}

  const handleOptionsChange = useCallback((event) => {
    if (event.target.name === 'limit') {
      console.log('Limit changed to:', event.target.value)
      setLimit(Number(event.target.value))
      setStartIndex(0)
    } else if (event.target.name === 'pattern') {
      console.log('Pattern changed to:', event.target.value)
    }
  }, [])

  const filters = useMemo(
    () => ({
      hasPattern: pattern && pattern.trim() !== '',
      hasBothDates: startDate && endDate,
      hasOnlyOneDate: (startDate && !endDate) || (!startDate && endDate),
      isStartAfterEnd: startDate && endDate && startDate.isAfter(endDate),
      startDateStr: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDateStr: endDate ? endDate.format('YYYY-MM-DD') : '',
    }),
    [pattern, startDate, endDate],
  )

  const isViewDisabled = useMemo(() => {
    if (startDate && !endDate) return true
    if (filters.hasBothDates && filters.isStartAfterEnd) return true
    return false
  }, [startDate, endDate, filters])

  const handleViewClick = () => {
    if (isViewDisabled) return
    setStartIndex(0)
    const currentPattern = document.getElementById(AUDIT_PATTERN_ID)?.value?.trim() || ''
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

  const dummyLogs = [
    '24-06 11:54:14.291 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:63- , ********** Audit Request Detail Start **********',
    '24-06 11:54:14.292 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:69- User fetched /scopes using client:null,',
    '24-06 11:54:14.295 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:72- , ********** Audit Request Detail Start **********',
    '24-06 11:54:14.295 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:77- endPoint: /scopes, beanClassName:org.jboss.weld.interceptor.proxy.NonTerminalAroundInvokeInvocationContext, method:getScopes, from:123.281.8.12, user:null',
    '24-06 11:54:14.295 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:82- headerData: {user-inow=null}',
    '24-06 11:54:14.296 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:type, clazz:class java.lang.String, clazz.isPrimitive():false',
    '24-06 11:54:14.296 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.296 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:limit, clazz:int, clazz.isPrimitive():true',
    '24-06 11:54:14.296 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:pattern, clazz:class java.lang.String, clazz.isPrimitive():false',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:startIndex, clazz:int, clazz.isPrimitive():true',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:sortBy, clazz:class java.lang.String, clazz.isPrimitive():false',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:sortOrder, clazz:class java.lang.String, clazz.isPrimitive():false',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:withAssociatedClients, clazz:boolean, clazz.isPrimitive():true',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:fieldValuePair, clazz:class java.lang.String, clazz.isPrimitive():false',
    '24-06 11:54:14.297 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.298 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:82-  , ********** Audit Request Detail End **********',
    '24-06 11:54:14.298 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:87- , ********** Audit Request Detail End **********',
    '24-06 11:54:14.298 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:100- , ********** Audit Response Detail Start **********',
    '24-06 11:54:14.298 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:94- , ********** Audit Response Detail Start **********',
    '24-06 11:54:14.298 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:95- HTTP Status:200 OK',
    '24-06 11:54:14.298 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:101- HTTP Status:200 OK',
    '24-06 11:54:14.298 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:96- API Call:getScopes',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:102- API Call:getScopes',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:125- RequestReaderInterceptor - Processing Data - paramCount:3 ,parameters:[java.lang.String searchPattern, int limit, boolean dn], clazzArray:[class java.lang.String, int, boolean]',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:searchPattern, clazz:class java.lang.String, clazz.isPrimitive():false',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:limit, clazz:int, clazz.isPrimitive():true',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:dn, clazz:boolean, clazz.isPrimitive():true',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.299 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:132-  Method call parameters:[], method:count',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:scope, clazz:interface io.jans.model.ldap.GluuLdapConfiguration, clazz.isPrimitive():false',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:searchPattern, clazz:class java.lang.String, clazz.isPrimitive():false',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:limit, clazz:int, clazz.isPrimitive():true',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:dn, clazz:boolean, clazz.isPrimitive():true',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:132-  Method call parameters:[java.lang.String, int, boolean], method:findScopes',
    '24-06 11:54:14.300 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:totalCount, clazz:int, clazz.isPrimitive():true',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:start, clazz:int, clazz.isPrimitive():true',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:entriesCount, clazz:int, clazz.isPrimitive():true',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:111- propertyName:entries, clazz:class java.util.ArrayList, clazz.isPrimitive():false',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:117- RequestReaderInterceptor final - obj - , obj:',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:103- Response:org.jboss.resteasy.core.interception.ServerWriterInterceptorContext@5f5d6f6e',
    '24-06 11:54:14.301 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:97- Response:org.jboss.resteasy.core.interception.ServerWriterInterceptorContext@5f5d6f6e',
    '24-06 11:54:14.302 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:98- , ********** Audit Response Detail End **********',
    '24-06 11:54:14.302 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:104- , ********** Audit Response Detail End **********',
    '24-06 11:54:14.302 INFO [gtp1487470647-23] jans.configapi.interceptor.DataLogInterceptor.java:108- , ********** DataLogInterceptor - DONE **********',
    '24-06 11:54:14.302 INFO [gtp1487470647-23] jans.configapi.interceptor.AuditLogInterceptor.java:102- , ********** AuditLogInterceptor - DONE **********',
  ]
  const dummyRows = dummyLogs.map((log, idx) => ({ serial: idx + 1, log }))

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <MaterialTable
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          columns={tableColumns}
          data={dummyRows}
          isLoading={false}
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
                    pattern="" // Don't pass pattern state
                    handler={handleOptionsChange}
                    showLimit={false}
                  />
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
