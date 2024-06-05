import React, { useCallback, useContext, useState } from 'react'
import { ThemeContext } from 'Context/theme/themeContext'
import { useDispatch, useSelector } from 'react-redux'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router'
import getThemeColor from 'Context/theme/config'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { putConfiguration } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import { buildPayload, hasPermission, JANS_KC_LINK_WRITE, JANS_KC_LINK_READ } from 'Utils/PermChecker'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const Sources = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const navigate = useNavigate()
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  let actions = []
  const dispatch = useDispatch()
  const configuration = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )
  const userAction = {}
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const { sourceConfigs = [] } = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )
  const loading = useSelector((state) => state.ldapReducer.loading)

  const columns = [
    { field: 'configId', title: `${t('fields.name')}` },
    { field: 'enabled', title: `${t('fields.enabled')}` },
  ]

  const navigateToEdit = (rowData) => {
    delete rowData?.tableData
    navigate('/jans-kc-link/sources/edit', {
      state: { sourceConfig: rowData },
    })
  }

  const deleteConfig = (data) => {
    setItem(data)
    toggle()
  }

  const navigateToAdd = () => navigate('/jans-kc-link/sources/add')

  const navigateToView = (rowData) => navigate('/jans-kc-link/sources/view', { state: { sourceConfig: rowData, viewOnly: true } })

  actions.push((rowData) => ({
    icon: 'edit',
    iconProps: {
      id: 'editClient' + rowData.configId,
    },
    tooltip: `${t('messages.edit_configuration')}`,
    onClick: (event, rowData) => navigateToEdit(rowData),
    disabled: !hasPermission(permissions, JANS_KC_LINK_WRITE),
  }))

  actions.push((rowData) => ({
    icon: DeleteIcon,
    iconProps: {
      color: 'secondary',
      id: 'deleteClient' + rowData.configId,
    },
    tooltip: `${t('messages.delete_configuration')}`,
    onClick: (event, rowData) => deleteConfig(rowData),
    disabled: !hasPermission(permissions, JANS_KC_LINK_WRITE),
  }))

  actions.push({
    icon: 'add',
    tooltip: `${t('messages.add_configuration')}`,
    iconProps: { color: 'primary' },
    isFreeAction: true,
    onClick: () => navigateToAdd(),
    disabled: !hasPermission(permissions, JANS_KC_LINK_WRITE),
  })

  actions.push({
    icon: 'visibility',
    tooltip: `${t('messages.view_configuration')}`,
    onClick: (event, rowData) => navigateToView(rowData),
    disabled: !hasPermission(permissions, JANS_KC_LINK_READ),
  })

  const PaperContainer = useCallback(
    (props) => <Paper {...props} elevation={0} />,
    []
  )

  const DeleteIcon = useCallback((props) => <DeleteOutlined />, [])

  function onDeletionConfirmed(message) {
    const sourceConfigs = configuration.sourceConfigs?.filter(
      (config) => config.configId !== item.configId
    )
    buildPayload(userAction, message, {
      appConfiguration4: {
        ...configuration,
        sourceConfigs: sourceConfigs,
      },
    })
    dispatch(putConfiguration({ action: userAction }))
    toggle()
  }

  return (
    <>
      <GluuViewWrapper canShow={true}>
        <MaterialTable
          key={'jans kc sourceConfigs'}
          components={{
            Container: PaperContainer,
          }}
          columns={columns}
          data={sourceConfigs}
          isLoading={loading}
          title=''
          actions={actions}
          options={{
            actionsColumnIndex: -1,
            search: true,
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              ...bgThemeColor,
            },
          }}
        />
      </GluuViewWrapper>
      <GluuDialog
        row={item}
        name={item?.configId}
        handler={toggle}
        modal={modal}
        subject='jans kc source'
        onAccept={onDeletionConfirmed}
        feature={adminUiFeatures.jans_keycloak_link_write}
      />
    </>
  )
}

export default Sources