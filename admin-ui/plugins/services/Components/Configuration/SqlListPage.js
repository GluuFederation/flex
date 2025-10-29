import React, { useState, useEffect, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCedarling } from '@/cedarling'
import { Paper } from '@mui/material'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SqlDetailPage from './SqlDetailPage'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import Alert from '@mui/material/Alert'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { getPersistenceType } from 'Plugins/services/redux/features/persistenceTypeSlice'
import { buildPayload, SQL_READ, SQL_WRITE, SQL_DELETE } from 'Utils/PermChecker'
import {
  getSqlConfig,
  setCurrentItem,
  deleteSql,
  testSql,
} from 'Plugins/services/redux/features/sqlSlice'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import customColors from '@/customColors'
import { getPagingSize } from '@/utils/pagingUtils'

function SqlListPage() {
  const { hasCedarPermission, authorize } = useCedarling()
  const sqlConfigurations = useSelector((state) => state.sqlReducer.sql)
  const loading = useSelector((state) => state.sqlReducer.loading)
  const testStatus = useSelector((state) => state.sqlReducer.testStatus)
  const persistenceType = useSelector((state) => state.persistenceTypeReducer.type)
  const persistenceTypeLoading = useSelector((state) => state.persistenceTypeReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const dispatch = useDispatch()

  // Initialize Cedar permissions
  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [SQL_READ, SQL_WRITE, SQL_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
    dispatch(getSqlConfig())
    dispatch(getPersistenceType())
  }, [dispatch])

  const { t } = useTranslation()
  const userAction = {}
  const [myActions, setMyActions] = useState([])
  const navigate = useNavigate()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const pageSize = getPagingSize()
  const [alertObj, setAlertObj] = useState({
    severity: '',
    message: '',
    show: false,
  })
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const toggle = () => setModal(!modal)
  SetTitle(t('titles.sql_authentication'))

  // Build actions only when permissions change
  useEffect(() => {
    const actions = []

    const canRead = hasCedarPermission(SQL_READ)
    const canWrite = hasCedarPermission(SQL_WRITE)
    const canDelete = hasCedarPermission(SQL_DELETE)

    if (canWrite) {
      actions.push({
        icon: 'add',
        tooltip: `${t('tooltips.add_sql')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: handleGoToSqlAddPage,
      })
      actions.push((rowData) => ({
        icon: 'edit',
        iconProps: {
          id: 'editSql' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('tooltips.edit_sql')}`,
        onClick: (event, rowData) => handleGoToSqlEditPage(rowData),
        disabled: !canWrite,
      }))
    }

    if (canRead) {
      actions.push({
        icon: 'refresh',
        tooltip: `${t('tooltips.refresh_data')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          dispatch(getSqlConfig())
        },
      })
    }

    if (canDelete) {
      actions.push((rowData) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteSql' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('tooltips.delete_record')}`,
        onClick: (event, rowData) => handleSqlDelete(rowData),
        disabled: !canDelete,
      }))
    }

    setMyActions(actions)
  }, [cedarPermissions, t, dispatch])

  const handleGoToSqlEditPage = useCallback(
    (row) => {
      dispatch(setCurrentItem(row))
      navigate(`/config/sql/edit/:` + row.configId)
    },
    [dispatch, navigate],
  )

  const handleSqlDelete = useCallback((row) => {
    setItem(row)
    toggle()
  }, [])

  const handleGoToSqlAddPage = useCallback(() => {
    navigate('/config/sql/new')
  }, [navigate])

  const onDeletionConfirmed = useCallback(
    (message) => {
      buildPayload(userAction, message, item.configId)
      dispatch(deleteSql(item.configId))
      navigate('/config/sql')
      toggle()
    },
    [item.configId, dispatch, navigate],
  )

  const testSqlConnect = useCallback(
    (row) => {
      const testPromise = new Promise(function (resolve) {
        setAlertObj({ ...alertObj, show: false })
        resolve()
      })

      testPromise
        .then(() => {
          dispatch(testSql(row))
        })
        .then(() => {
          if (testStatus) {
            setAlertObj({
              ...alertObj,
              severity: 'success',
              message: `${t('messages.sql_connection_success')}`,
              show: true,
            })
          } else {
            setAlertObj({
              ...alertObj,
              severity: 'error',
              message: `${t('messages.sql_connection_error')}`,
              show: true,
            })
          }
        })
    },
    [alertObj, testStatus, dispatch, t],
  )
  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuLoader blocking={persistenceTypeLoading}>
          {persistenceType == `sql` ? (
            <MaterialTable
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              columns={[
                { title: `${t('fields.name')}`, field: 'configId' },
                {
                  title: `${t('fields.connectionUris')}`,
                  field: 'connectionUri',
                },
                { title: `${t('fields.schemaName')}`, field: 'schemaName' },
              ]}
              data={sqlConfigurations}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                search: true,
                selection: false,
                pageSize: pageSize,
                headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
                actionsColumnIndex: -1,
              }}
              detailPanel={(rowData) => {
                return <SqlDetailPage row={rowData.rowData} testSqlConnection={testSqlConnect} />
              }}
            />
          ) : (
            <Alert severity="info">The current data store provider is not RDBMS.</Alert>
          )}
          <GluuAlert severity={alertObj.severity} message={alertObj.message} show={alertObj.show} />
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="sql"
            onAccept={onDeletionConfirmed}
          />
        </GluuLoader>
      </CardBody>
    </Card>
  )
}

export default SqlListPage
