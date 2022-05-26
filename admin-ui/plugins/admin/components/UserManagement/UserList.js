import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@material-ui/core'
import UserDetailViewPage from './UserDetailViewPage'
// import RoleAddDialogForm from './RoleAddDialogForm'
import { Badge } from 'reactstrap'
import { getUsers, setSelectedUserData } from '../../redux/actions/UserActions'
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
    console.log('HERE')
  }, [])

  const usersList = useSelector((state) => state.userReducer.items)
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
    return history.push('/adm/usermanagement/add')
  }
  function handleGoToUserEditPage(row) {
    console.log('edit data', row)
    dispatch(setSelectedUserData(row))
    return history.push(`/adm/usermanagement/edit:` + row.tableData.uuid)
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
              // {
              //   title: `${t('fields.email')}`,
              //   field: 'emails',
              //   render: (rowData) => {
              //     return rowData.emails.map((data, key) => {
              //       return (
              //         <Badge
              //           color={data.primary ? 'primary' : 'info'}
              //           key={'UL_email_' + key}
              //         >
              //           {data.value}
              //         </Badge>
              //       )
              //     })
              //   },
              // },
            ]}
            data={usersList}
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
