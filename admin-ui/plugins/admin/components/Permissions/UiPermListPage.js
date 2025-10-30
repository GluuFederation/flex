import React, { useEffect, useState, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import UiPermDetailPage from './UiPermDetailPage'
import { Badge } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useCedarling } from '@/cedarling'
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
  buildPayload,
  PERMISSION_READ,
  PERMISSION_WRITE,
  PERMISSION_DELETE,
} from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { isEmpty } from 'lodash'
import customColors from '@/customColors'
import { getPagingSize } from '@/utils/pagingUtils'

function UiPermListPage() {
  const { hasCedarPermission, authorize } = useCedarling()
  const apiPerms = useSelector((state) => state.apiPermissionReducer.items)
  const loading = useSelector((state) => state.apiPermissionReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  // State for managing actions and UI
  const [myActions, setMyActions] = useState([])
  const [modal, setModal] = useState(false)

  // Theme and styling
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  // Constants
  const userAction = {}
  const pageSize = getPagingSize()

  SetTitle(t('menus.securityDropdown.capabilities'))

  // Permission initialization and data fetching
  useEffect(() => {
    const authorizePermissions = async () => {
      const permissions = [PERMISSION_READ, PERMISSION_WRITE, PERMISSION_DELETE]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing permission permissions:', error)
      }
    }

    authorizePermissions()
    doFetchList()
  }, [])

  useEffect(() => {
    const actions = []

    if (hasCedarPermission(PERMISSION_WRITE)) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_permission')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => handleAddNewPermission(),
      })
    }

    setMyActions(actions)
  }, [cedarPermissions])

  // Handler functions
  const handleAddNewPermission = useCallback(() => {
    toggle()
  }, [])

  const toggle = useCallback(() => setModal(!modal), [modal])

  const doFetchList = useCallback(() => {
    const options = []
    buildPayload(userAction, 'PERMISSIONS', options)
    dispatch(getPermissions({ action: userAction }))
  }, [dispatch])

  const onAddConfirmed = useCallback(
    (roleData) => {
      buildPayload(userAction, 'message', roleData)
      dispatch(addPermission({ action: userAction }))
      toggle()
    },
    [dispatch, toggle],
  )

  // MaterialTable options
  const tableOptions = {
    search: true,
    idSynonym: 'inum',
    searchFieldAlignment: 'left',
    selection: false,
    pageSize: pageSize,
    rowStyle: (rowData) => ({
      backgroundColor: rowData.enabled ? customColors.logo : customColors.white,
    }),
    headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
    actionsColumnIndex: -1,
  }

  // Editable configuration
  const editableConfig = {
    isDeleteHidden: () => !hasCedarPermission(PERMISSION_DELETE),
    isEditHidden: () => !hasCedarPermission(PERMISSION_WRITE),
    onRowUpdate: (newData) =>
      new Promise((resolve) => {
        buildPayload(userAction, 'Edit permision', newData)
        dispatch(editPermission({ action: userAction }))
        resolve()
        doFetchList()
      }),
    onRowDelete: (oldData) =>
      new Promise((resolve) => {
        if (!isEmpty(oldData)) {
          buildPayload(userAction, 'Remove permission', oldData)
          dispatch(deletePermission({ action: userAction }))
        }
        resolve()
      }),
  }

  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const DetailPanel = useCallback((rowD) => <UiPermDetailPage row={rowD} />, [])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(PERMISSION_READ)}>
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
                title: `${t('fields.essentialUIPermission')}`,
                field: 'essentialPermissionInAdminUI',
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
            options={tableOptions}
            detailPanel={DetailPanel}
            editable={editableConfig}
          />
        </GluuViewWrapper>
        <PermissionAddDialogForm handler={toggle} modal={modal} onAccept={onAddConfirmed} />
      </CardBody>
    </Card>
  )
}

export default UiPermListPage
