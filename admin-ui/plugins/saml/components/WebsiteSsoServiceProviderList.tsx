import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import MaterialTable, { type Action } from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload, type UserAction } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DeleteOutlined } from '@mui/icons-material'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { PaperContainer, getServiceProviderTableCols } from '../helper/tableUtils'
import customColors from '@/customColors'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import {
  useTrustRelationships,
  useDeleteTrustRelationshipMutation,
  type TrustRelationship,
} from './hooks'
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
  const selectedTheme = useMemo(() => theme?.state?.theme ?? DEFAULT_THEME, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const [modal, setModal] = useState(false)
  const [item, setItem] = useState<DeleteItem>({ inum: '' })

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()

  const {
    data: websiteSsoServiceProviders = [],
    isLoading: isInitialLoading,
    isFetching: isFetchingData,
    refetch,
  } = useTrustRelationships()
  const deleteTrustRelationshipMutation = useDeleteTrustRelationshipMutation()

  const isLoading = isInitialLoading || isFetchingData || deleteTrustRelationshipMutation.isPending

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

  const handleGoToEditPage = useCallback(
    (rowData: TrustRelationship, viewOnly?: boolean) => {
      navigateToRoute(ROUTES.SAML_SP_EDIT, { state: { rowData: rowData, viewOnly: viewOnly } })
    },
    [navigateToRoute],
  )

  const handleGoToAddPage = useCallback(() => {
    navigateToRoute(ROUTES.SAML_SP_ADD)
  }, [navigateToRoute])

  const handleDelete = useCallback(
    (row: TrustRelationship) => {
      setItem({ inum: row.inum || '', displayName: row.displayName })
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    async (message: string) => {
      toggle()

      const userAction: UserAction = {
        action_message: '',
        action_data: '',
      }
      buildPayload(userAction, message, item.inum)
      try {
        await deleteTrustRelationshipMutation.mutateAsync({
          id: userAction.action_data as string,
          userMessage: userAction.action_message,
        })
      } catch (error) {
        console.error('Failed to delete service provider:', error)
      }
    },
    [deleteTrustRelationshipMutation, item.inum, toggle],
  )

  const handleRefresh = useCallback((): void => {
    refetch()
  }, [refetch])

  const tableActions = useMemo(() => {
    const actions: Action<TrustRelationship>[] = []
    if (canWriteWebsiteSsoServiceProviders) {
      actions.push({
        icon: 'edit',
        tooltip: `${t('messages.edit_service_provider')}`,
        iconProps: { style: { color: customColors.darkGray } },
        onClick: (
          _event: React.MouseEvent,
          rowData: TrustRelationship | TrustRelationship[],
        ): void => {
          if (Array.isArray(rowData)) return
          const { tableData, ...clean } = rowData as TrustRelationship & {
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
          rowData: TrustRelationship | TrustRelationship[],
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
          rowData: TrustRelationship | TrustRelationship[],
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
    <GluuLoader blocking={isLoading}>
      <GluuViewWrapper canShow={canReadWebsiteSsoServiceProviders}>
        <MaterialTable
          components={{
            Container: PaperContainer,
          }}
          columns={tableColumns}
          data={websiteSsoServiceProviders}
          isLoading={isLoading}
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
    </GluuLoader>
  )
})

WebsiteSsoServiceProviderList.displayName = 'WebsiteSsoServiceProviderList'

export default WebsiteSsoServiceProviderList
