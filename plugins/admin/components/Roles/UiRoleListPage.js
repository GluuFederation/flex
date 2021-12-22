import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import { Paper } from '@material-ui/core'
import UiRoleDetailPage from './UiRoleDetailPage'
import { Badge } from 'reactstrap'
import { connect } from 'react-redux'
import { Card, CardBody, FormGroup } from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { getRoles, editRole } from '../../redux/actions/ApiRoleActions'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
  ROLE_WRITE,
} from '../../../../app/utils/PermChecker'

function UiRoleListPage({ apiRoles, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const myActions = []
  const options = []
  const userAction = {}
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [data, setData] = useState(apiRoles)
  useEffect(() => {
    buildPayload(userAction, 'ROLES', options)
    dispatch(getRoles(userAction))
  }, [])

  if (hasPermission(permissions, ROLE_READ)) {
    myActions.push((rowData) => ({
      icon: 'visibility',
      iconProps: {
        color: 'primary',
        id: 'viewRole' + rowData.inum,
      },
      tooltip: `${t('messages.view_role_details')}`,
      onClick: (e, rowData) => handleGoToRoleEditPage(rowData, true),
      disabled: false,
    }))
  }

  return (
    <Card>
      <GluuRibbon title={t('titles.roles')} fromLeft />
      <CardBody>
        <FormGroup row />
        <FormGroup row />
        <GluuViewWrapper canShow={hasPermission(permissions, ROLE_READ)}>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={[
              {
                title: `${t('fields.name')}`,
                field: 'role',
                width: '40%',
                editable: false,
                render: (rowData) => <Badge color="info">{rowData.role}</Badge>,
              },
              { title: `${t('fields.description')}`, field: 'description' },
            ]}
            data={data}
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
            detailPanel={(rowData) => {
              return <UiRoleDetailPage row={rowData} />
            }}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  dispatch(editRole)
                  setTimeout(() => {
                    const dataUpdate = [...data]
                    const index = oldData.tableData.id
                    dataUpdate[index] = newData
                    setData([...dataUpdate])

                    resolve()
                  }, 1000)
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...data]
                    const index = oldData.tableData.id
                    dataDelete.splice(index, 1)
                    setData([...dataDelete])

                    resolve()
                  }, 1000)
                }),
            }}
          />
        </GluuViewWrapper>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    apiRoles: state.apiRoleReducer.items,
    loading: state.apiRoleReducer.loading,
    permissions: state.authReducer.permissions,
  }
}

export default connect(mapStateToProps)(UiRoleListPage)
