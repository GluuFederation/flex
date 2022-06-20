import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { Paper } from '@material-ui/core'
import UserDetailViewPage from './UserDetailViewPage'
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
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'

function UserList(props) {
  const dispatch = useDispatch()
  let opt = {}
  useEffect(() => {
    opt['limit'] = 0
    dispatch(getUsers({}))
    dispatch(getAttributes(opt))
  }, [])

  const usersList = useSelector((state) => state.userReducer.items)
  const redirectToUserListPage = useSelector(
    (state) => state.userReducer.redirectToUserListPage,
  )
  const loading = useSelector((state) => state.userReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const toggle = () => setModal(!modal)
  const submitForm = () => {
    toggle()
    handleUserDelete(deleteData)
  }

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
      onClick: (event, rowData) => {
        setDeleteData(rowData)
        toggle()
      },
      disabled: false,
    }))
  }

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
      </CardBody>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </Card>
  )
}
export default UserList
