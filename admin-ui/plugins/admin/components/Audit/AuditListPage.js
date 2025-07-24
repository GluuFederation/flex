import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react'
import moment from 'moment'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
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
import { getAuditLogs } from 'Plugins/admin/redux/features/auditSlice'

function AuditListPage() {
  const { audits, loading } = useSelector((state) => state.auditReducer)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pageSize = Number(localStorage.getItem('paggingSize')) || 10
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const userAction = {}
  const options = {}

  SetTitle(t('menus.audit_logs'))

  const tableColumns = useMemo(
    () => [
      { title: `${t('fields.date')}`, field: 'date' },
      {
        title: `${t('fields.info')}`,
        field: 'info',
        render: (rowData) => (
          <span>{moment(rowData.timestamp).format('ddd, MMM DD, YYYY h:mm:ss A')}</span>
        ),
      },
      { title: `${t('fields.headers')}`, field: 'header' },
    ],
    [t],
  )
  const [updatedColumns, setUpdatedColumns] = useState(tableColumns)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState('')

  const handleOptionsChange = useCallback((event) => {
    console.log('event.target.name', event.target.name)
    if (event.target.name === 'limit') {
      setLimit(event.target.value)
    } else if (event.target.name === 'pattern') {
      setPattern(event.target.value)
    }
  }, [])

  function fetchAuditInfo() {
    buildPayload(userAction, 'GET Audit Logs', options)
    // dispatch({ type: 'audit/getAuditLogs', action: options })
    dispatch({ type: 'audit/getAuditLogs', payload: options })
  }

  useEffect(() => {
    fetchAuditInfo()
    setUpdatedColumns(tableColumns)
  }, [tableColumns])

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
              tooltip: `${t('messages.advanced_search')}`,
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
