import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MaterialTable, { type Action } from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload, type UserAction } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DeleteOutlined } from '@mui/icons-material'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import {
  getWebsiteSsoServiceProvider,
  deleteWebsiteSsoServiceProvider,
} from 'Plugins/saml/redux/features/SamlSlice'
import { PaperContainer, getServiceProviderTableCols } from '../helper/tableUtils'
import customColors from '@/customColors'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { WebsiteSsoServiceProvider } from '../types/redux'
import type { SamlRootState } from '../types/state'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface DeleteItem {
  inum: string
  displayName?: string
  tableData?: Record<string, unknown>
}

const DeleteOutlinedIcon = () => <DeleteOutlined />

const WebsiteSsoServiceProviderList = React.memo(() => {
  const { authorizeHelper, hasCedarReadPermission, hasCedarWritePermission } = useCedarling()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const [modal, setModal] = useState(false)
  const [item, setItem] = useState<DeleteItem>({ inum: '' })

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { websiteSsoServiceProviders, loadingWebsiteSsoServiceProvider } = useSelector(
    (state: SamlRootState) => state.idpSamlReducer,
  )
  const samlResourceId = useMemo(() => ADMIN_UI_RESOURCES.SAML, [])
  const samlScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[samlResourceId], [samlResourceId])
  const canReadWebsiteSsoServiceProviders = useMemo(
    () => hasCedarReadPermission(samlResourceId),
    [hasCedarReadPermission, samlResourceId],
  )
  const canWriteWebsiteSsoServiceProviders = useMemo(
    () => hasCedarWritePermission(samlResourceId),
    [hasCedarWritePermission, samlResourceId],
  )

  useEffect(() => {
    authorizeHelper(samlScopes)
  }, [authorizeHelper, samlScopes])

  useEffect(() => {
    if (!canReadWebsiteSsoServiceProviders) {
      return
    }
    dispatch(getWebsiteSsoServiceProvider())
  }, [dispatch, canReadWebsiteSsoServiceProviders])

  const handleGoToEditPage = useCallback(
    (rowData: WebsiteSsoServiceProvider, viewOnly?: boolean) => {
      navigateToRoute(ROUTES.SAML_SP_EDIT, { state: { rowData: rowData, viewOnly: viewOnly } })
    },
    [navigateToRoute],
  )

  const handleGoToAddPage = useCallback(() => {
    navigateToRoute(ROUTES.SAML_SP_ADD)
  }, [navigateToRoute])

  const handleDelete = useCallback(
    (row: WebsiteSsoServiceProvider) => {
      setItem(row)
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    (message: string) => {
      const userAction: UserAction = {
        action_message: '',
        action_data: '',
      }
      buildPayload(userAction, message, item.inum)
      dispatch(
        deleteWebsiteSsoServiceProvider({
          action: {
            action_data: userAction.action_data as string,
            action_message: userAction.action_message,
          },
        }),
      )
      toggle()
    },
    [dispatch, item.inum, toggle],
  )

  const handleRefresh = useCallback((): void => {
    dispatch(getWebsiteSsoServiceProvider())
  }, [dispatch])

  const tableActions = useMemo(() => {
    const actions: Action<WebsiteSsoServiceProvider>[] = []
    if (canWriteWebsiteSsoServiceProviders) {
      actions.push({
        icon: 'edit',
        tooltip: `${t('messages.edit_service_provider')}`,
        iconProps: { style: { color: customColors.darkGray } },
        onClick: (
          _event: React.MouseEvent,
          rowData: WebsiteSsoServiceProvider | WebsiteSsoServiceProvider[],
        ): void => {
          if (Array.isArray(rowData)) return
          const { tableData, ...clean } = rowData as WebsiteSsoServiceProvider & {
            tableData?: unknown
          }
          void tableData
          handleGoToEditPage(clean)
        },
      })
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_service_provider')}`,
        iconProps: { color: 'primary' },
        isFreeAction: true,
        onClick: () => handleGoToAddPage(),
      })
    }
    if (canReadWebsiteSsoServiceProviders) {
      actions.push({
        icon: 'visibility',
        tooltip: `${t('messages.view_service_provider')}`,
        onClick: (
          _event: React.MouseEvent,
          rowData: WebsiteSsoServiceProvider | WebsiteSsoServiceProvider[],
        ): void => {
          if (Array.isArray(rowData)) return
          handleGoToEditPage(rowData, true)
        },
      })
    }
    if (canWriteWebsiteSsoServiceProviders) {
      actions.push({
        icon: DeleteOutlinedIcon,
        iconProps: { color: 'secondary' },
        tooltip: `${t('messages.delete_service_provider')}`,
        onClick: (
          _event: React.MouseEvent,
          rowData: WebsiteSsoServiceProvider | WebsiteSsoServiceProvider[],
        ): void => {
          if (Array.isArray(rowData)) return
          handleDelete(rowData)
        },
      })
    }
    actions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: handleRefresh,
    })
    return actions
  }, [
    canReadWebsiteSsoServiceProviders,
    canWriteWebsiteSsoServiceProviders,
    t,
    handleGoToEditPage,
    handleGoToAddPage,
    handleDelete,
    handleRefresh,
  ])

  const tableColumns = useMemo(() => getServiceProviderTableCols(t), [t])

  return (
    <>
      <GluuViewWrapper canShow={canReadWebsiteSsoServiceProviders}>
        <MaterialTable
          components={{
            Container: PaperContainer,
          }}
          columns={tableColumns}
          data={websiteSsoServiceProviders}
          isLoading={loadingWebsiteSsoServiceProvider}
          title=""
          actions={tableActions}
          options={{
            search: true,
            searchFieldAlignment: 'left',
            selection: false,
            pageSize: 10,
            idSynonym: 'inum',
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              backgroundColor: themeColors.background,
              color: themeColors.fontColor,
            } as React.CSSProperties,
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>
      {canWriteWebsiteSsoServiceProviders && (
        <GluuDialog
          row={item}
          name={item?.displayName || ''}
          handler={toggle}
          modal={modal}
          subject="saml website sso service provider"
          onAccept={onDeletionConfirmed}
        />
      )}
    </>
  )
})

WebsiteSsoServiceProviderList.displayName = 'WebsiteSsoServiceProviderList'

export default WebsiteSsoServiceProviderList
