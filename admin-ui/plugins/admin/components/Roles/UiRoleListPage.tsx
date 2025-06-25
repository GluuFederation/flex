import React, { useEffect, useState, useContext } from 'react'
import MaterialTable, { Action, MaterialTableProps } from '@material-table/core'
import { Paper } from '@mui/material'
import UiRoleDetailPage from './UiRoleDetailPage'
import RoleAddDialogForm from './RoleAddDialogForm'
import { Badge } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  getRoles,
  addRole,
  editRole,
  deleteRole,
} from 'Plugins/admin/redux/features/apiRoleSlice'
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
import { toast } from 'react-toastify'

// Type definitions
interface Role {
  inum: string
  role: string
  description: string
  deletable: boolean
  enabled?: boolean
}

interface RootState {
  apiRoleReducer: {
    items: Role[]
    loading: boolean
  }
  authReducer: {
    permissions: string[]
  }
}

interface RoleData {
  role: string
  description: string
  deletable: boolean
}

interface UserAction {
  [key: string]: any
}

interface ThemeState {
  theme: string
}

interface ThemeContextType {
  state: ThemeState
}

function UiRoleListPage(): JSX.Element {
  const apiRoles = useSelector((state: RootState) => state.apiRoleReducer.items)
  const loading = useSelector((state: RootState) => state.apiRoleReducer.loading)
  const permissions = useSelector((state: RootState) => state.authReducer.permissions)

  const [modal, setModal] = useState<boolean>(false)
  const myActions: Action<Role>[] = []
  const options: any[] = []
  const userAction: UserAction = {}
  const pageSize: number = parseInt(localStorage.getItem('paggingSize') || '10', 10)
  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const toggle = (): void => setModal(!modal)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    doFetchList()
  }, [])

  SetTitle(t('titles.roles'))

  if (hasPermission(permissions, ROLE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_role')}`,
      iconProps: { color: 'primary' as const },
      isFreeAction: true,
      onClick: () => handleAddNewRole(),
    })
  }

  function handleAddNewRole(): void {
    toggle()
  }

  function doFetchList(): void {
    buildPayload(userAction, 'ROLES', options)
    dispatch(getRoles({ action: userAction }))
  }

  function onAddConfirmed(roleData: RoleData): void {
    buildPayload(userAction, 'message', roleData)

    const fetchRoles = apiRoles.filter((role: Role) => role.role === roleData.role)
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
          <MaterialTable<Role>
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            columns={[
              {
                title: `${t('fields.name')}`,
                field: 'role',
                width: '40%',
                editable: 'never',
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
                      className='form-control'
                      value={String(rowData.rowData.deletable)}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
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
            title=''
            actions={myActions}
            options={{
              search: true,
              idSynonym: 'inum',
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: pageSize,
              rowStyle: (rowData) => ({
                backgroundColor: (rowData as Role & { enabled?: boolean }).enabled ? '#33AE9A' : '#FFF',
              }),
              headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor } as React.CSSProperties,
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <UiRoleDetailPage row={rowData} />
            }}
            editable={{
              isDeleteHidden: () => !hasPermission(permissions, ROLE_DELETE),
              isEditHidden: () => !hasPermission(permissions, ROLE_WRITE),
              onRowUpdate: (newData, oldData) =>
                new Promise<void>((resolve, reject) => {
                  buildPayload(userAction, 'Edit role', newData)
                  dispatch(editRole({ action: userAction }))
                  resolve()
                  doFetchList()
                }),
              onRowDelete: (oldData) =>
                new Promise<void>((resolve, reject) => {
                  buildPayload(userAction, 'remove role', oldData)
                  dispatch(deleteRole({ action: userAction }))
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

export default UiRoleListPage
