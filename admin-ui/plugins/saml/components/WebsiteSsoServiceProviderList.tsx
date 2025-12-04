import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MaterialTable, { type Action } from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DeleteOutlined } from '@mui/icons-material'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import {
  getTrustRelationship,
  deleteTrustRelationship,
} from 'Plugins/saml/redux/features/SamlSlice'
import { PaperContainer, getServiceProviderTableCols } from '../helper/tableUtils'
import customColors from '@/customColors'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { TrustRelationship } from '../types/redux'
import type { SamlRootState } from '../types/state'

interface DeleteItem {
  inum: string
  displayName?: string
  tableData?: Record<string, never>
}

const WebsiteSsoServiceProviderList = React.memo(() => {
  const { authorizeHelper, hasCedarReadPermission, hasCedarWritePermission } = useCedarling()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = useMemo(
    () => ({ background: themeColors.background }),
    [themeColors.background],
  )
  const [modal, setModal] = useState(false)
  const [item, setItem] = useState<DeleteItem>({ inum: '' })

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { trustRelationships, loadingTrustRelationship } = useSelector(
    (state: SamlRootState) => state.idpSamlReducer,
  )
  const samlResourceId = useMemo(() => ADMIN_UI_RESOURCES.SAML, [])
  const samlScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[samlResourceId], [samlResourceId])
  const canReadTrustRelationships = useMemo(
    () => hasCedarReadPermission(samlResourceId),
    [hasCedarReadPermission, samlResourceId],
  )
  const canWriteTrustRelationships = useMemo(
    () => hasCedarWritePermission(samlResourceId),
    [hasCedarWritePermission, samlResourceId],
  )

  useEffect(() => {
    authorizeHelper(samlScopes)
  }, [authorizeHelper, samlScopes])

  useEffect(() => {
    if (!canReadTrustRelationships) {
      return
    }
    dispatch(getTrustRelationship())
  }, [dispatch, canReadTrustRelationships])

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
      setItem(row)
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    (message: string) => {
      const userAction: { action_message?: string; action_data?: string } = {}
      buildPayload(userAction, message, item.inum)
      dispatch(deleteTrustRelationship({ action: { action_data: userAction.action_data ?? '' } }))
      toggle()
    },
    [dispatch, item.inum, toggle],
  )

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])

  const tableActions = useMemo(() => {
    const actions: Action<TrustRelationship>[] = []
    if (canWriteTrustRelationships) {
      actions.push({
        icon: 'edit',
        tooltip: `${t('messages.edit_service_provider')}`,
        iconProps: { color: 'primary', style: { color: customColors.darkGray } },
        onClick: (
          _event: React.MouseEvent,
          rowData: TrustRelationship | TrustRelationship[],
        ): void => {
          if (Array.isArray(rowData)) return
          const data = { ...rowData }
          if ('tableData' in data) {
            delete (data as { tableData?: Record<string, never> }).tableData
          }
          handleGoToEditPage(data)
        },
      })
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
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_service_provider')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => handleGoToAddPage(),
      })
    }
    if (canReadTrustRelationships) {
      actions.push({
        icon: 'visibility',
        iconProps: { style: { color: customColors.darkGray } },
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
    return actions
  }, [
    canReadTrustRelationships,
    canWriteTrustRelationships,
    t,
    handleGoToEditPage,
    handleGoToAddPage,
    handleDelete,
    DeleteOutlinedIcon,
  ])

  const tableColumns = useMemo(() => getServiceProviderTableCols(t), [t])

  return (
    <>
      <GluuViewWrapper canShow={canReadTrustRelationships}>
        <MaterialTable
          components={{
            Container: PaperContainer,
          }}
          columns={tableColumns}
          data={trustRelationships}
          isLoading={loadingTrustRelationship}
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
              ...bgThemeColor,
            } as React.CSSProperties,
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>
      {canWriteTrustRelationships && (
        <GluuDialog
          row={item}
          name={item?.displayName || ''}
          handler={toggle}
          modal={modal}
          subject="saml trust relationship"
          onAccept={onDeletionConfirmed}
        />
      )}
    </>
  )
})

WebsiteSsoServiceProviderList.displayName = 'WebsiteSsoServiceProviderList'

export default WebsiteSsoServiceProviderList
