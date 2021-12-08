import React, { useEffect } from 'react'
import MaterialTable from 'material-table'
import { Paper } from '@material-ui/core'
import UiPermDetailPage from './UiPermDetailPage'
import { Badge } from 'reactstrap'
import { connect } from 'react-redux'
import { Card, CardBody, FormGroup } from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { getPermissions } from '../../redux/actions/ApiPermissionActions'
import {
  hasPermission,
  buildPayload,
  PERMISSION_READ,
  PERMISSION_WRITE,
} from '../../../../app/utils/PermChecker'

function UiPermListPage({ apiPerms, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const myActions = []
  const options = []
  const userAction = {}
  const pageSize = localStorage.getItem('paggingSize') || 10
  useEffect(() => {
    buildPayload(userAction, 'PERMISSIONS', options)
    dispatch(getPermissions(userAction))
  }, [])

  if (hasPermission(permissions, PERMISSION_READ)) {
    myActions.push((aRow) => ({
      icon: 'visibility',
      iconProps: {
        color: 'primary',
        id: 'viewRole' + aRow.inum,
      },
      tooltip: `${t('messages.view_role_details')}`,
      onClick: (e, v) => handleGoToPermissionEditPage(v, true),
      disabled: false,
    }))
  }

  if (hasPermission(permissions, PERMISSION_WRITE)) {
    myActions.push((rowD) => ({
      icon: 'edit',
      iconProps: {
        color: 'primary',
        id: 'editRole' + rowD.inum,
      },
      tooltip: `${t('messages.edit_role')}`,
      onClick: (e, entry) => handleGoToPermissionEditPage(entry, false),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, PERMISSION_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_role')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToPermissionAddPage(),
    })
  }

  return (
    <Card>
      <GluuRibbon title={t('titles.roles')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper canShow={hasPermission(permissions, PERMISSION_READ)}>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={[
              {
                title: `${t('fields.name')}`,
                field: 'permission',
                width: '50%',
                render: (rowData) => (
                  <Badge color="info">{rowData.permission}</Badge>
                ),
              },
              //{ title: `${t('fields.description')}`, field: 'description' },
            ]}
            data={apiPerms}
            isLoading={loading || false}
            title=""
            actions={myActions}
            options={{
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              rowStyle: (rowData) => ({
                backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
              }),
              headerStyle: applicationStyle.tableHeaderStyle,
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowD) => {
              return <UiPermDetailPage row={rowD} />
            }}
          />
        </GluuViewWrapper>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    apiPerms: state.apiPermissionReducer.items,
    loading: state.apiPermissionReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(UiPermListPage)
