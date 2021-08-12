import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import GluuDialog from '../../../../app/routes/Apps/Gluu/GluuDialog'
import Alert from '@material-ui/lab/Alert';
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import {
  hasPermission,
  buildPayload,
  SQL_READ,
  SQL_WRITE,
  SQL_DELETE,
} from '../../../../app/utils/PermChecker'
import {
  getSqlConfig,
  setCurrentItem,
  deleteSql,
  testSql,
} from '../../redux/actions/SqlActions'
import { useTranslation } from 'react-i18next'

function SqlListPage({
  sqlConfigurations,
  permissions,
  loading,
  dispatch,
  testStatus,
  persistenceType,
}) {
  useEffect(() => {
    dispatch(getSqlConfig())
  }, [])
  const { t } = useTranslation()
  const userAction = {}
  const myActions = []
  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [pageSize, setPageSize] = useState(localStorage.getItem('paggingSize') || 10)
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
        color: 'primary',
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
      icon: 'delete',
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

  function getBadgeTheme(status) {
    if (status) {
      return 'primary'
    } else {
      return 'warning'
    }
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
    <React.Fragment>
      {persistenceType == `sql` ? 
      (<MaterialTable
        columns={[
          { title: `${t('fields.configuration_id')}`, field: 'configId' },
          { title: `${t('fields.connectionUri')}`, field: 'connectionUri' },
          { title: `${t('fields.schemaName')}`, field: 'schemaName' },
        ]}
        data={sqlConfigurations}
        isLoading={loading}
        title={t('titles.sql_authentication')}
        actions={myActions}
        options={{
          search: true,
          selection: false,
          pageSize: pageSize,
          headerStyle: {
            backgroundColor: '#03a96d',
            color: '#FFF',
            padding: '2px',
            textTransform: 'uppercase',
            fontSize: '18px',
          },
          actionsColumnIndex: -1,
        }}
        detailPanel={(rowData) => {
          return (
            <LdapDetailPage
              row={rowData}
              testSqlConnection={testSqlConnect}
            />
          )
        }}
      />) : (<Alert severity="info">The database of Authentication server is not RDBMS.</Alert>)}
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
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    sqlConfigurations: state.sqlReducer.sql,
    loading: state.sqlReducer.loading,
    permissions: state.authReducer.permissions,
    testStatus: state.sqlReducer.testStatus,
    persistenceType: state.persistenceTypeReducer.type
  }
}
export default connect(mapStateToProps)(SqlListPage)
