import React, { useCallback, useContext, useEffect, useState } from 'react'
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
import { putCacheRefreshConfiguration } from 'Plugins/jans-link/redux/features/CacheRefreshSlice'
import { buildPayload } from 'Utils/PermChecker'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const SourceBackendServersTab = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const navigate = useNavigate()
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  let actions = []
  const dispatch = useDispatch()
  const cacheRefreshConfiguration = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const userAction = {}
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const { sourceConfigs } = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const loading = useSelector((state) => state.ldapReducer.loading)

  const tableColumns = [
    { field: 'configId', title: `${t('fields.name')}` },
    { field: 'enabled', title: `${t('fields.enabled')}` },
  ]

  const navigateToEdit = (rowData) => {
    delete rowData?.tableData
    navigate('/jans-link/source-backend-ldap-servers/edit', { state: { sourceConfig: rowData } })
  }

  const deleteConfig = (data) => {
    setItem(data)
    toggle()
  }

  const navigateToAdd = () => {
    navigate('/jans-link/source-backend-ldap-servers/add')
  }

  actions.push((rowData) => ({
    icon: 'edit',
    iconProps: {
      id: 'editClient' + rowData.configId,
    },
    tooltip: `${t('messages.edit_configuration')}`,
    onClick: (event, rowData) => navigateToEdit(rowData),
    disabled: false,
  }))

  actions.push((rowData) => ({
    icon: DeleteIcon,
    iconProps: {
      color: 'secondary',
      id: 'deleteClient' + rowData.configId,
    },
    tooltip: `${t('messages.delete_configuration')}`,
    onClick: (event, rowData) => deleteConfig(rowData),
    disabled: false,
  }))

  actions.push({
    icon: 'add',
    tooltip: `${t('messages.add_configuration')}`,
    iconProps: { color: 'primary' },
    isFreeAction: true,
    onClick: () => navigateToAdd(),
  })

  const PaperContainer = useCallback(
    (props) => <Paper {...props} elevation={0} />,
    []
  )

  const DeleteIcon = useCallback(
    (props) => <DeleteOutlined />,
    []
  )

  function onDeletionConfirmed(message) {
    const sourceConfigs = cacheRefreshConfiguration?.sourceConfigs?.filter((config) => config.configId !== item.configId)
    buildPayload(userAction, message, {
      appConfiguration2: {
        ...cacheRefreshConfiguration,
        sourceConfigs: sourceConfigs,
      },
    })
    dispatch(putCacheRefreshConfiguration({ action: userAction }))
    toggle()
  }

  return (
    <>
      <GluuViewWrapper canShow={true}>
        <MaterialTable
          key={'sourceConfigs'}
          components={{
            Container: PaperContainer,
          }}
          columns={tableColumns}
          data={sourceConfigs || []}
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
        name={item?.configId || ''}
        handler={toggle}
        modal={modal}
        subject='openid connect client'
        onAccept={onDeletionConfirmed}
        feature={adminUiFeatures.jans_link_write}
      />
    </>
  )
}

export default SourceBackendServersTab
