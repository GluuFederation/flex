import React, { useEffect, useState, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import UiPermDetailPage from './UiPermDetailPage'
import { Badge } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import PermissionAddDialogForm from './PermissionAddDialogForm'
import {
  getPermissions,
  deletePermission,
  editPermission,
  addPermission,
} from 'Plugins/admin/redux/features/apiPermissionSlice'
import {
  hasPermission,
  buildPayload,
  PERMISSION_READ,
  PERMISSION_WRITE,
  PERMISSION_DELETE,
} from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { isEmpty } from 'lodash'

function UiPermListPage() {
  const apiPerms = useSelector((state) => state.apiPermissionReducer.items)
  const loading = useSelector((state) => state.apiPermissionReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)

  const dispatch = useDispatch()
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

  SetTitle(t('titles.permissions'))

  if (hasPermission(permissions, PERMISSION_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_permission')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleAddNewPermission(),
    })
  }

  function handleAddNewPermission() {
    toggle()
  }
  function doFetchList() {
    buildPayload(userAction, 'PERMISSIONS', options)
    dispatch(getPermissions({ action: userAction }))
  }
  function onAddConfirmed(roleData) {
    buildPayload(userAction, 'message', roleData)
    dispatch(addPermission({ action: userAction }))
    toggle()
  }

  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const DetailPanel = useCallback((rowD) => <UiPermDetailPage row={rowD} />, [])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, PERMISSION_READ)}>
          <MaterialTable
            components={{
              Container: PaperContainer,
            }}
            columns={[
              {
                title: `${t('fields.name')}`,
                field: 'permission',
                editable: 'never',
                width: '50%',
                render: (rowData) => (
                  <Badge color={`primary-${selectedTheme}`}>{rowData.permission}</Badge>
                ),
              },
              {
                title: `${t('fields.tag')}`,
                field: 'tag',
                editable: 'never',
              },
              {
                title: `${t('fields.default_permission_in_token')}`,
                field: 'defaultPermissionInToken',
                editable: 'never',
              },
              { title: `${t('fields.description')}`, field: 'description' },
            ]}
            data={apiPerms}
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
            }}
            detailPanel={DetailPanel}
            editable={{
              isDeleteHidden: () => !hasPermission(permissions, PERMISSION_DELETE),
              isEditHidden: () => !hasPermission(permissions, PERMISSION_WRITE),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  buildPayload(userAction, 'Edit permision', newData)
                  dispatch(editPermission({ action: userAction }))
                  resolve()
                  doFetchList()
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  if (!isEmpty(oldData)) {
                    buildPayload(userAction, 'Remove permission', oldData)
                    dispatch(deletePermission({ action: userAction }))
                  }
                  resolve()
                }),
            }}
          />
        </GluuViewWrapper>
        <PermissionAddDialogForm handler={toggle} modal={modal} onAccept={onAddConfirmed} />
      </CardBody>
    </Card>
  )
}

export default UiPermListPage
