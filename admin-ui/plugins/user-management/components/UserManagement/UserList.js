import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { Paper } from '@material-ui/core'
import UserDetailViewPage from './UserDetailViewPage'
// import RoleAddDialogForm from './RoleAddDialogForm'
import { Badge } from 'reactstrap'
import {
  getUsers,
  setSelectedUserData,
  redirectToListPage,
  deleteExistingUser,
} from '../../redux/actions/UserActions'

import { getAttributes } from '../../../schema/redux/actions/AttributeActions'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, FormGroup } from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuRibbon from '../../../../app/routes/Apps/Gluu/GluuRibbon'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { useHistory } from 'react-router-dom'
import {
  hasPermission,
  buildPayload,
  ROLE_READ,
  ROLE_WRITE,
} from '../../../../app/utils/PermChecker'

function UserList(props) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsers({}))
    dispatch(getAttributes({}))
  }, [])

  const usersList = useSelector((state) => state.userReducer.items)
  const redirectToUserListPage = useSelector(
    (state) => state.userReducer.redirectToUserListPage,
  )
  const loading = useSelector((state) => state.userReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const myActions = []
  const options = []
  const userAction = {}
  const pageSize = localStorage.getItem('paggingSize') || 10
  const history = useHistory()

  function handleGoToUserAddPage() {
    dispatch(setSelectedUserData(null))
    return history.push('/user/usermanagement/add')
  }
  function handleGoToUserEditPage(row) {
    dispatch(setSelectedUserData(row))
    return history.push(`/user/usermanagement/edit:` + row.tableData.uuid)
  }

  useEffect(() => {
    if (redirectToUserListPage) {
      dispatch(redirectToListPage(false))
    }
  }, [redirectToUserListPage])

  function handleUserDelete(row) {
    dispatch(deleteExistingUser(row.inum))
  }

  if (hasPermission(permissions, ROLE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_role')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToUserAddPage(),
    })
  }
  if (hasPermission(permissions, ROLE_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editScope' + rowData.inum,
      },
      onClick: (event, rowData) => handleGoToUserEditPage(rowData),
      disabled: !hasPermission(permissions, ROLE_WRITE),
    }))
  }
  if (hasPermission(permissions, ROLE_WRITE)) {
    myActions.push((rowData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        color: 'secondary',
        id: 'deleteClient' + rowData.inum,
      },
      onClick: (event, rowData) => handleUserDelete(rowData),
      disabled: false,
    }))
  }

  // function handleAddNewRole() {
  //   toggle()
  // }
  // function doFetchList() {
  //   buildPayload(userAction, 'ROLES', options)
  //   dispatch(getRoles(userAction))
  // }
  // function onAddConfirmed(roleData) {
  //   buildPayload(userAction, 'message', roleData)
  //   dispatch(addRole(userAction))
  //   toggle()
  //   doFetchList()
  // }

  return (
    <Card>
      <GluuRibbon title={t('titles.user_management')} fromLeft />
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
                field: 'displayName',
              },
              { title: `${t('fields.userName')}`, field: 'userId' },
              { title: `${t('fields.email')}`, field: 'mail' },
            ]}
            data={usersList}
            isLoading={loading}
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
              return <UserDetailViewPage row={rowData} />
            }}
          />
        </GluuViewWrapper>
        {/* <RoleAddDialogForm
          handler={toggle}
          modal={modal}
          onAccept={onAddConfirmed}
        /> */}
      </CardBody>
    </Card>
  )
}
export default UserList
