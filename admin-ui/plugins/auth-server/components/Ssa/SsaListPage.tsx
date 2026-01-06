import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { useDispatch } from 'react-redux'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable, { type Action } from '@material-table/core'
import { Paper } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { DeleteOutlined, DownloadOutlined, VisibilityOutlined } from '@mui/icons-material'
import SsaDetailPage from './SsaDetailPage'
import JsonViewerDialog from '../JsonViewer/JsonViewerDialog'
import customColors from '@/customColors'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useRevokeSsa, type RevokeSsaParams } from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAllSsas, useGetSsaJwt, useSsaAuditLogger, SSA_QUERY_KEYS } from './hooks'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { formatExpirationDate } from './utils/dateFormatters'
import type { SsaData, SsaJwtResponse } from './types'
import { DELETION } from '../../../../app/audit/UserActionType'
import { SSA as SSA_RESOURCE } from '../../redux/audit/Resources'
import { updateToast } from 'Redux/features/toastSlice'

const SSAListPage: React.FC = () => {
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const queryClient = useQueryClient()
  const [limit] = useState<number>(10)
  const [item, setItem] = useState<SsaData | null>(null)
  const [modal, setModal] = useState<boolean>(false)
  const toggle = (): void => setModal(!modal)

  const { data: items = [], isLoading: loading } = useGetAllSsas()

  // Add unique id to each row for MaterialTable
  const rowsWithId = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        id: item.ssa.jti || `${item.ssa.software_id}-${item.ssa.org_id}`,
      })),
    [items],
  )
  const revokeSsaMutation = useRevokeSsa({
    mutation: {
      onError: (error) => {
        console.error('Failed to revoke SSA:', error)
        dispatch(updateToast(true, 'error', t('messages.error_in_saving')))
      },
    },
  })
  const getSsaJwtMutation = useGetSsaJwt()

  const { logAudit } = useSsaAuditLogger()

  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.ssa_management'))
  const [ssaDialogOpen, setSsaDialogOpen] = useState<boolean>(false)
  const [jwtData, setJwtData] = useState<SsaJwtResponse | null>(null)

  const ssaResourceId = ADMIN_UI_RESOURCES.SSA
  const ssaScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[ssaResourceId] || [], [ssaResourceId])

  const canReadSsa = useMemo(
    () => hasCedarReadPermission(ssaResourceId),
    [hasCedarReadPermission, ssaResourceId],
  )
  const canWriteSsa = useMemo(
    () => hasCedarWritePermission(ssaResourceId),
    [hasCedarWritePermission, ssaResourceId],
  )
  const canDeleteSsa = useMemo(
    () => hasCedarDeletePermission(ssaResourceId),
    [hasCedarDeletePermission, ssaResourceId],
  )

  useEffect(() => {
    authorizeHelper(ssaScopes)
  }, [authorizeHelper, ssaScopes])

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const tableColumns = useMemo(
    () => [
      { title: t('fields.software_id'), field: 'ssa.software_id' },
      {
        title: t('fields.organization'),
        field: 'ssa.org_id',
      },
      {
        title: t('fields.status'),
        field: 'status',
      },
      {
        title: t('fields.expiration'),
        field: 'expiration',
        render: (rowData: SsaData) => formatExpirationDate(rowData.expiration),
      },
    ],
    [t],
  )

  const myActions: Array<Action<SsaData> | ((rowData: SsaData) => Action<SsaData>)> = []

  if (canWriteSsa) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_ssa')}`,
      iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
      isFreeAction: true,
      onClick: () => handleGoToSsaAddPage(),
    })
  }

  if (canWriteSsa || canDeleteSsa) {
    myActions.push((rowData: SsaData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        sx: { color: customColors.accentRed },
        id: rowData.ssa.org_id,
      },
      onClick: (_event: unknown, rowData: SsaData | SsaData[]) => {
        if (rowData && !Array.isArray(rowData)) {
          handleSsaDelete(rowData)
        }
      },
    }))
  }

  if (canReadSsa || canWriteSsa) {
    myActions.push((rowData: SsaData) => ({
      icon: () => <VisibilityOutlined />,
      iconProps: {
        color: 'primary',
        id: rowData.ssa.org_id,
        style: { color: customColors.lightBlue },
      },
      onClick: (_event: unknown, rowData: SsaData | SsaData[]) => {
        if (rowData && !Array.isArray(rowData)) {
          handleViewSsa(rowData)
        }
      },
      disabled: getSsaJwtMutation.isPending,
    }))
    myActions.push((rowData: SsaData) => ({
      icon: () => <DownloadOutlined />,
      iconProps: {
        color: 'primary',
        id: rowData.ssa.org_id,
        style: { color: customColors.lightBlue },
      },
      onClick: (_event: unknown, rowData: SsaData | SsaData[]) => {
        if (rowData && !Array.isArray(rowData)) {
          handleDownloadSsa(rowData)
        }
      },
      disabled: getSsaJwtMutation.isPending,
    }))
  }

  const handleSsaDelete = (row: SsaData): void => {
    setItem(row)
    toggle()
  }

  const toggleSsaDialog = (): void => {
    setSsaDialogOpen(!ssaDialogOpen)
    if (ssaDialogOpen) {
      setJwtData(null)
    }
  }

  const handleGoToSsaAddPage = (): void => {
    navigateToRoute(ROUTES.AUTH_SERVER_SSA_ADD)
  }

  const onDeletionConfirmed = async (message: string): Promise<void> => {
    if (!item || isDeleting) return

    setIsDeleting(true)
    try {
      const params: RevokeSsaParams = { jti: item.ssa.jti }
      await revokeSsaMutation.mutateAsync({ params })

      await logAudit({
        action: DELETION,
        resource: SSA_RESOURCE,
        message: message || 'SSA deleted successfully',
        payload: { jti: item.ssa.jti, org_id: item.ssa.org_id },
      })

      dispatch(updateToast(true, 'success'))
      toggle()
      queryClient.invalidateQueries({ queryKey: SSA_QUERY_KEYS.all })
    } catch (error) {
      console.error('Failed to delete SSA:', error)
      dispatch(updateToast(true, 'error'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewSsa = (row: SsaData): void => {
    setJwtData(null)
    setSsaDialogOpen(true)
    getSsaJwtMutation.mutate(row.ssa.jti, {
      onSuccess: (fetchedJwtData) => {
        setJwtData(fetchedJwtData)
      },
      onError: (error) => {
        console.error('Failed to fetch SSA JWT:', error)
        dispatch(updateToast(true, 'error'))
        setSsaDialogOpen(false)
      },
    })
  }

  const handleDownloadSsa = async (row: SsaData): Promise<void> => {
    try {
      const jwtData = await getSsaJwtMutation.mutateAsync(row.ssa.jti)
      const blob = new Blob([jwtData.ssa], { type: 'text/plain' })
      const link = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      link.href = objectUrl
      const dateStr = new Date()
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/[/:,]/g, '-')
        .replace(/\s/g, '_')
      link.download = `ssa-${row.ssa.software_id}-${dateStr}.jwt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Failed to download SSA JWT:', error)
      dispatch(updateToast(true, 'error'))
    }
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={canReadSsa}>
          <MaterialTable
            key={limit || 0}
            components={{
              Container: PaperContainer,
            }}
            columns={tableColumns}
            data={rowsWithId || []}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
                textTransform: applicationStyle.tableHeaderStyle.textTransform as
                  | 'uppercase'
                  | 'lowercase'
                  | 'none',
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={({ rowData }: { rowData: SsaData }) => {
              return <SsaDetailPage row={rowData} />
            }}
          />
        </GluuViewWrapper>
        {(canWriteSsa || canDeleteSsa) && item && (
          <GluuDialog
            row={item}
            name={item.ssa.org_id || ''}
            handler={toggle}
            modal={modal}
            subject="ssa configuration"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.ssa_delete}
          />
        )}
        {ssaDialogOpen && (
          <JsonViewerDialog
            isOpen={ssaDialogOpen}
            toggle={toggleSsaDialog}
            data={jwtData}
            isLoading={getSsaJwtMutation.isPending}
            title={`JSON View`}
            theme="light"
            expanded={true}
          />
        )}
      </CardBody>
    </Card>
  )
}

SSAListPage.displayName = 'SSAListPage'

export default SSAListPage
