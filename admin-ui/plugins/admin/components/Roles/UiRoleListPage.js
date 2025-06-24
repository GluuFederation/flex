import React, { useEffect, useState, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import UiRoleDetailPage from './UiRoleDetailPage'
import RoleAddDialogForm from './RoleAddDialogForm'
import { Badge } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { getRoles, addRole, editRole, deleteRole } from 'Plugins/admin/redux/features/apiRoleSlice'
import { hasPermission, buildPayload, ROLE_READ, ROLE_WRITE } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { ROLE_DELETE } from '../../../../app/utils/PermChecker'
import { toast } from 'react-toastify'

function UiRoleListPage() {
  const apiRoles = useSelector((state) => state.apiRoleReducer.items)
  const loading = useSelector((state) => state.apiRoleReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)

  const [modal, setModal] = useState(false)
  const myActions = [],
    options = [],
    userAction = {},
    pageSize = localStorage.getItem('paggingSize') || 10,
    theme = useContext(ThemeContext),
    selectedTheme = theme.state.theme,
    themeColors = getThemeColor(selectedTheme),
    bgThemeColor = { background: themeColors.background },
    toggle = () => setModal(!modal),
    { t } = useTranslation(),
    dispatch = useDispatch()

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
    dispatch(getRoles({ action: userAction }))
  }
  function onAddConfirmed(roleData) {
    buildPayload(userAction, 'message', roleData)

    const fetchRoles = apiRoles.filter((role) => role.role === roleData.role)
    if (fetchRoles.length > 0) {
      toast.error(`${t('messages.role_already_exists')}`)
    } else {
      dispatch(addRole({ action: userAction }))
      toggle()
    }
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
                editable: 'never',
                render: (rowData) => (
                  <Badge color={`primary-${selectedTheme}`}>{rowData.role}</Badge>
                ),
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
                      value={String(rowData.rowData.deletable) == 'true' ? true : false}
                    >
                      <option value={true}>true</option>
                      <option value={false}>false</option>
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
              idSynonym: 'inum',
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              rowStyle: (rowData) => ({
                backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
              }),
              headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
              actionsColumnIndex: -1,
              columns: [
                {
                  title: `${t('fields.name')}`,
                  field: 'role',
                  width: '40%',
                  editable: 'never',
                },
                { title: `${t('fields.description')}`, field: 'description' },
                {
                  title: `${t('fields.deletable')}`,
                  field: 'deletable',
                },
              ],
            }}
            detailPanel={(rowData) => {
              return <UiRoleDetailPage row={rowData} />
            }}
            editable={{
              isDeleteHidden: () => !hasPermission(permissions, ROLE_DELETE),
              isEditHidden: () => !hasPermission(permissions, ROLE_WRITE),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  buildPayload(userAction, 'Edit role', newData)
                  dispatch(editRole({ action: userAction }))
                  resolve()
                  doFetchList()
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  buildPayload(userAction, 'remove role', oldData)
                  dispatch(deleteRole({ action: userAction }))
                  resolve()
                  doFetchList()
                }),
            }}
          />
        </GluuViewWrapper>
        <RoleAddDialogForm handler={toggle} modal={modal} onAccept={onAddConfirmed} />
      </CardBody>
    </Card>
  )
}

export default UiRoleListPage
