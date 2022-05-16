import React, { useState, useEffect } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core'
import { Card, CardBody, FormGroup } from 'Components'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SqlDetailPage from './SqlDetailPage'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import Alert from '@material-ui/lab/Alert'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { getPersistenceType } from 'Plugins/services/redux/actions/PersistenceActions'
import {
  hasPermission,
  buildPayload,
  SQL_READ,
  SQL_WRITE,
  SQL_DELETE,
} from 'Utils/PermChecker'
import {
  getSqlConfig,
  setCurrentItem,
  deleteSql,
  testSql,
} from 'Plugins/services/redux/actions/SqlActions'
import { useTranslation } from 'react-i18next'

function SqlListPage({
  sqlConfigurations,
  permissions,
  loading,
  dispatch,
  testStatus,
  persistenceType,
  persistenceTypeLoading,
}) {
  useEffect(() => {
    dispatch(getSqlConfig())
    dispatch(getPersistenceType())
  }, [])
  const { t } = useTranslation()
  const userAction = {}
  const myActions = []
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [alertObj, setAlertObj] = useState({
    severity: '',
    message: '',
    show: false,
  })
  const toggle = () => setModal(!modal)

  function handleGoToSqlEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/config/sql/edit:` + row.configId)
  }

  function handleSqlDelete(row) {
    setItem(row)
    toggle()
  }
  function handleGoToSqlAddPage() {
    return history.push('/config/sql/new')
  }

  if (hasPermission(permissions, SQL_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editSql' + rowData.configId,
      },
      tooltip: `${t('tooltips.edit_sql')}`,
      onClick: (event, rowData) => handleGoToSqlEditPage(rowData),
      disabled: !hasPermission(permissions, SQL_WRITE),
    }))
  }

  if (hasPermission(permissions, SQL_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('tooltips.refresh_data')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        dispatch(getSqlConfig())
      },
    })
  }
  if (hasPermission(permissions, SQL_DELETE)) {
    myActions.push((rowData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        color: 'secondary',
        id: 'deleteSql' + rowData.configId,
      },
      tooltip: `${t('tooltips.delete_record')}`,
      onClick: (event, rowData) => handleSqlDelete(rowData),
      disabled: !hasPermission(permissions, SQL_DELETE),
    }))
  }
  if (hasPermission(permissions, SQL_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('tooltips.add_sql')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToSqlAddPage(),
    })
  }

  function onDeletionConfirmed(message) {
    buildPayload(userAction, message, item.configId)
    dispatch(deleteSql(item.configId))
    history.push('/config/sql')
    toggle()
  }
  function testSqlConnect(row) {
    const testPromise = new Promise(function (resolve, reject) {
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
  }
  return (
    <Card>
      <GluuRibbon title={t('titles.sql_authentication')} fromLeft />
      <FormGroup row />
      <FormGroup row />
      <FormGroup row />
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
                headerStyle: applicationStyle.tableHeaderStyle,
                actionsColumnIndex: -1,
              }}
              detailPanel={(rowData) => {
                return (
                  <SqlDetailPage
                    row={rowData.rowData}
                    testSqlConnection={testSqlConnect}
                  />
                )
              }}
            />
          ) : (
            <Alert severity="info">
              The current data store provider is not RDBMS.
            </Alert>
          )}
          <GluuAlert
            severity={alertObj.severity}
            message={alertObj.message}
            show={alertObj.show}
          />
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

const mapStateToProps = (state) => {
  return {
    sqlConfigurations: state.sqlReducer.sql,
    loading: state.sqlReducer.loading,
    permissions: state.authReducer.permissions,
    testStatus: state.sqlReducer.testStatus,
    persistenceType: state.persistenceTypeReducer.type,
    persistenceTypeLoading: state.persistenceTypeReducer.loading,
  }
}
export default connect(mapStateToProps)(SqlListPage)
