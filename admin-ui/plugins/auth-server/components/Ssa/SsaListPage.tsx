import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { useDispatch } from 'react-redux'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import MaterialTable, { type Action } from '@material-table/core'
import { Paper } from '@mui/material'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { SSA_PORTAL, SSA_ADMIN, SSA_DELETE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import SetTitle from 'Utils/SetTitle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { DeleteOutlined, DownloadOutlined, VisibilityOutlined } from '@mui/icons-material'
import SsaDetailPage from './SsaDetailPage'
import JsonViewerDialog from '../JsonViewer/JsonViewerDialog'
import customColors from '@/customColors'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useRevokeSsa } from 'JansConfigApi'
import { useGetAllSsas, useGetSsaJwt, useSsaAuditLogger } from './hooks'
import { formatExpirationDate } from './utils/dateFormatters'
import type { SsaData, SsaJwtResponse } from './types'
import { DELETION } from '../../../../app/audit/UserActionType'
import { SSA as SSA_RESOURCE } from '../../redux/audit/Resources'
import { updateToast } from 'Redux/features/toastSlice'

const SSAListPage: React.FC = () => {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [limit] = useState<number>(10)
  const [item, setItem] = useState<SsaData | null>(null)
  const [modal, setModal] = useState<boolean>(false)
  const toggle = (): void => setModal(!modal)

  const { data: items = [], isLoading: loading, refetch } = useGetAllSsas()
  const revokeSsaMutation = useRevokeSsa()
  const getSsaJwtMutation = useGetSsaJwt()

  const { logAudit } = useSsaAuditLogger()

  const [loadingJti, setLoadingJti] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.ssa_management'))
  const [ssaDialogOpen, setSsaDialogOpen] = useState<boolean>(false)
  const [jwtData, setJwtData] = useState<SsaJwtResponse | null>(null)

  useEffect(() => {
    let cancelled = false

    const authorizePermissions = async (): Promise<void> => {
      const permissions = [SSA_PORTAL, SSA_ADMIN, SSA_DELETE]
      try {
        await Promise.all(permissions.map((permission) => authorize([permission])))
      } catch (error) {
        if (!cancelled) {
          console.error('Error authorizing SSA permissions:', error)
          dispatch(updateToast(true, 'error', 'Failed to authorize permissions'))
        }
      }
    }

    authorizePermissions()

    return () => {
      cancelled = true
    }
  }, [authorize, dispatch])

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

  const DeleteIcon = useCallback(
    () => <DeleteOutlined style={{ color: customColors.darkGray }} />,
    [],
  )
  const DownloadIcon = useCallback(
    () => <DownloadOutlined style={{ color: customColors.darkGray }} />,
    [],
  )
  const ViewIcon = useCallback(
    () => <VisibilityOutlined style={{ color: customColors.darkGray }} />,
    [],
  )

  const myActions: Action<SsaData>[] = []

  if (hasCedarPermission(SSA_ADMIN)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_ssa')}`,
      iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
      isFreeAction: true,
      onClick: () => handleGoToSsaAddPage(),
      disabled: !hasCedarPermission(SSA_ADMIN),
    })
  }

  if (hasCedarPermission(SSA_ADMIN) || hasCedarPermission(SSA_DELETE)) {
    myActions.push((rowData: SsaData) => ({
      icon: DeleteIcon,
      iconProps: {
        sx: { color: customColors.accentRed },
        id: rowData.ssa.org_id,
      },
      onClick: () => handleSsaDelete(rowData),
      disabled: !hasCedarPermission(SSA_ADMIN) && !hasCedarPermission(SSA_DELETE),
    }))
  }

  if (hasCedarPermission(SSA_PORTAL) || hasCedarPermission(SSA_ADMIN)) {
    myActions.push((rowData: SsaData) => ({
      icon: ViewIcon,
      iconProps: {
        color: 'primary',
        id: rowData.ssa.org_id,
        style: { color: customColors.lightBlue },
      },
      onClick: () => handleViewSsa(rowData),
      disabled: loadingJti === rowData.ssa.jti,
    }))
    myActions.push((rowData: SsaData) => ({
      icon: DownloadIcon,
      iconProps: {
        color: 'primary',
        id: rowData.ssa.org_id,
        style: { color: customColors.lightBlue },
      },
      onClick: () => handleDownloadSsa(rowData),
      disabled: loadingJti === rowData.ssa.jti,
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
    navigate('/auth-server/config/ssa/new')
  }

  const onDeletionConfirmed = async (message: string): Promise<void> => {
    if (!item || isDeleting) return

    setIsDeleting(true)
    try {
      await revokeSsaMutation.mutateAsync({
        params: { jti: item.ssa.jti },
      })

      await logAudit({
        action: DELETION,
        resource: SSA_RESOURCE,
        message: message || 'SSA deleted successfully',
        payload: { jti: item.ssa.jti, org_id: item.ssa.org_id },
      })

      dispatch(updateToast(true, 'success'))
      toggle()
      refetch()
    } catch (error) {
      console.error('Failed to delete SSA:', error)
      dispatch(updateToast(true, 'error'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewSsa = async (row: SsaData): Promise<void> => {
    setLoadingJti(row.ssa.jti)
    try {
      const fetchedJwtData = await getSsaJwtMutation.mutateAsync(row.ssa.jti)
      setJwtData(fetchedJwtData)
      toggleSsaDialog()
    } catch (error) {
      console.error('Failed to fetch SSA JWT:', error)
      dispatch(updateToast(true, 'error'))
    } finally {
      setLoadingJti(null)
    }
  }

  const handleDownloadSsa = async (row: SsaData): Promise<void> => {
    setLoadingJti(row.ssa.jti)
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
        .replace(/[\/:,]/g, '-')
        .replace(/\s/g, '_')
      link.download = `ssa-${row.ssa.software_id}-${dateStr}.jwt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Failed to download SSA JWT:', error)
      dispatch(updateToast(true, 'error'))
    } finally {
      setLoadingJti(null)
    }
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(SSA_PORTAL)}>
          <MaterialTable
            key={limit || 0}
            components={{
              Container: PaperContainer,
            }}
            columns={tableColumns}
            data={items || []}
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
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={({ rowData }: { rowData: SsaData }) => {
              return <SsaDetailPage row={rowData} />
            }}
          />
        </GluuViewWrapper>
        {(hasCedarPermission(SSA_ADMIN) || hasCedarPermission(SSA_DELETE)) && item && (
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
        {jwtData && ssaDialogOpen && (
          <JsonViewerDialog
            isOpen={ssaDialogOpen}
            toggle={toggleSsaDialog}
            data={jwtData}
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
