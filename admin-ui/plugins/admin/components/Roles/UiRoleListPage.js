import React, { useEffect, useState, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import UiRoleDetailPage from './UiRoleDetailPage'
import RoleAddDialogForm from './RoleAddDialogForm'
import { Badge } from 'reactstrap'
import { connect } from 'react-redux'
import { Card, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  getRoles,
  addRole,
  editRole,
  deleteRole,
} from 'Plugins/admin/redux/actions/ApiRoleActions'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
  ROLE_WRITE,
} from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { ROLE_DELETE } from '../../../../app/utils/PermChecker'

function UiRoleListPage({ apiRoles, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const myActions = []
  const options = []
  const userAction = {}
  const pageSize = localStorage.getItem('paggingSize') || 10
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  useEffect(() => {
    doFetchList()
  }, [])

  SetTitle(t('titles.roles'))

  if (hasPermission(permissions, ROLE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_role')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleAddNewRole(),
    })
  }

  function handleAddNewRole() {
    toggle()
  }
  function doFetchList() {
    buildPayload(userAction, 'ROLES', options)
    dispatch(getRoles(userAction))
  }
  function onAddConfirmed(roleData) {
    buildPayload(userAction, 'message', roleData)
    dispatch(addRole(userAction))
    toggle()
    doFetchList()
  }
  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
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
                render: (rowData) => <Badge color={`primary-${selectedTheme}`}>{rowData.role}</Badge>,
              },
              { title: `${t('fields.description')}`, field: 'description' },
              {
                title: `${t('fields.deletable')}`,
                field: 'deletable',
                editComponent: (rowData) => {
                  return (
                    <select
                      onChange={(e) => rowData.onChange(e.target.value)}
                      className="form-control"
                    >
                      <option
                        selected={
                          String(rowData.rowData.deletable) == 'true'
                            ? true
                            : false
                        }
                        value={true}
                      >
                        true
                      </option>
                      <option
                        selected={
                          String(rowData.rowData.deletable) == 'false' ||
                          !rowData.rowData.deletable
                            ? true
                            : false
                        }
                        value={false}
                      >
                        false
                      </option>
                    </select>
                  )
                },
                render: (rowData) => {
                  return <div>{rowData?.deletable ? 'Yes' : 'No'}</div>
                },
              },
            ]}
            data={apiRoles}
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
              headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <UiRoleDetailPage row={rowData} />
            }}
            editable={{
              isDeleteHidden:() => !hasPermission(permissions, ROLE_DELETE),
              isEditHidden:() => !hasPermission(permissions, ROLE_WRITE),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  buildPayload(userAction, 'Edit role', newData)
                  dispatch(editRole(userAction))
                  resolve()
                  doFetchList()
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  buildPayload(userAction, 'remove role', oldData)
                  dispatch(deleteRole(userAction))
                  resolve()
                  doFetchList()
                }),
            }}
          />
        </GluuViewWrapper>
        <RoleAddDialogForm
          handler={toggle}
          modal={modal}
          onAccept={onAddConfirmed}
        />
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
