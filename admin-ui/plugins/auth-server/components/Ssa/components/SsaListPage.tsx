import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { DeleteOutlined, DownloadOutlined, VisibilityOutlined, Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import SetTitle from 'Utils/SetTitle'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { GluuBadge } from '@/components/GluuBadge'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import SsaDetailViewPage from './SsaDetailViewPage'
import JsonViewerDialog from '../../JsonViewer/JsonViewerDialog'
import { useStyles } from './styles/SsaListPage.style'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAllSsas, useGetSsaJwt, useRevokeSsaWithAudit, SSA_QUERY_KEYS } from '../hooks'
import { formatExpirationDate } from '../utils/dateFormatters'
import { downloadJwtFile } from '../utils/fileDownload'
import type { SsaData } from '../types/SsaApiTypes'
import type { SsaTableRowData } from '../types/SsaFormTypes'

const SsaListPage: React.FC = () => {
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const queryClient = useQueryClient()

  const [modal, setModal] = useState<boolean>(false)
  const [deleteData, setDeleteData] = useState<SsaTableRowData | null>(null)
  const [pattern, setPattern] = useState<string>('')
  const [ssaDialogOpen, setSsaDialogOpen] = useState<boolean>(false)
  const [jwtData, setJwtData] = useState<{ ssa: string } | null>(null)

  const { state: themeState } = useTheme()
  const selectedTheme = themeState.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const LIMIT_OPTIONS = useMemo(() => getRowsPerPageOptions(), [])

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

  SetTitle(t('titles.ssa_management'))

  const { data: items = [], isLoading: loading } = useGetAllSsas()
  const getSsaJwtMutation = useGetSsaJwt()
  const { revokeSsa, isLoading: isDeleting } = useRevokeSsaWithAudit()

  const rowsWithId: SsaTableRowData[] = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        id: item.ssa.jti || `${item.ssa.software_id}-${item.ssa.org_id}`,
      })),
    [items],
  )

  const filteredRows = useMemo(() => {
    if (!pattern) return rowsWithId
    const lowerPattern = pattern.toLowerCase()
    return rowsWithId.filter(
      (row) =>
        row.ssa.software_id.toLowerCase().includes(lowerPattern) ||
        row.ssa.org_id.toLowerCase().includes(lowerPattern) ||
        row.status.toLowerCase().includes(lowerPattern),
    )
  }, [rowsWithId, pattern])

  const totalItems = filteredRows.length
  const { classes } = useStyles({ isDark, themeColors })

  const toggle = useCallback((): void => setModal((prev) => !prev), [])

  const handleRefresh = useCallback((): void => {
    setPattern('')
    setPageNumber(0)
    queryClient.invalidateQueries({ queryKey: SSA_QUERY_KEYS.all })
  }, [queryClient, setPageNumber])

  const handleGoToSsaAddPage = useCallback((): void => {
    navigateToRoute(ROUTES.AUTH_SERVER_SSA_ADD)
  }, [navigateToRoute])

  const toggleSsaDialog = useCallback((): void => {
    setSsaDialogOpen((prev) => {
      if (prev) setJwtData(null)
      return !prev
    })
  }, [])

  const handleViewSsa = useCallback(
    async (row: SsaTableRowData): Promise<void> => {
      setJwtData(null)
      setSsaDialogOpen(true)
      try {
        const fetchedJwtData = await getSsaJwtMutation.mutateAsync(row.ssa.jti)
        setJwtData(fetchedJwtData)
      } catch (error) {
        console.error('Failed to fetch SSA JWT:', error)
        dispatch(updateToast(true, 'error'))
        setSsaDialogOpen(false)
      }
    },
    [getSsaJwtMutation, dispatch],
  )

  const handleDownloadSsa = useCallback(
    async (row: SsaTableRowData): Promise<void> => {
      try {
        const jwtResponse = await getSsaJwtMutation.mutateAsync(row.ssa.jti)
        downloadJwtFile(jwtResponse.ssa, row.ssa.software_id)
      } catch (error) {
        console.error('Failed to download SSA JWT:', error)
        dispatch(updateToast(true, 'error'))
      }
    },
    [getSsaJwtMutation, dispatch],
  )

  const submitForm = useCallback(
    async (userMessage: string) => {
      if (!deleteData) return
      try {
        await revokeSsa(deleteData.ssa.jti, userMessage, {
          jti: deleteData.ssa.jti,
          org_id: deleteData.ssa.org_id,
        })
        setDeleteData(null)
      } catch (error) {
        console.error('Delete SSA failed:', error)
      }
    },
    [deleteData, revokeSsa],
  )

  const handlePageChange = useCallback((page: number) => setPageNumber(page), [setPageNumber])

  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  const columns: ColumnDef<SsaTableRowData>[] = useMemo(
    () =>
      [
        {
          key: 'ssa',
          label: t('fields.software_id'),
          render: (value) => (value as SsaData['ssa']).software_id,
        },
        {
          key: 'ssa',
          id: 'org_id',
          label: t('fields.organization'),
          render: (value) => (value as SsaData['ssa']).org_id,
        },
        {
          key: 'status',
          label: t('fields.status'),
          render: (value) => (
            <GluuBadge
              size="md"
              backgroundColor={String(value).toLowerCase() === 'active' ? '#e6f4ea' : '#fce4ec'}
              textColor={String(value).toLowerCase() === 'active' ? '#1e7e34' : '#c62828'}
              borderRadius={6}
            >
              {String(value)}
            </GluuBadge>
          ),
        },
        {
          key: 'expiration',
          label: t('fields.expiration'),
          render: (value) => formatExpirationDate(value as number),
        },
      ] as ColumnDef<SsaTableRowData>[],
    [t],
  )

  const actions = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode
      tooltip: string
      id?: string
      onClick: (row: SsaTableRowData) => void
    }> = []

    if (canReadSsa || canWriteSsa) {
      list.push({
        icon: <VisibilityOutlined className={classes.actionIcon} />,
        tooltip: t('tooltips.view_ssa'),
        id: 'viewSsa',
        onClick: handleViewSsa,
      })
      list.push({
        icon: <DownloadOutlined className={classes.actionIcon} />,
        tooltip: t('tooltips.download_ssa'),
        id: 'downloadSsa',
        onClick: handleDownloadSsa,
      })
    }

    if (canWriteSsa || canDeleteSsa) {
      list.push({
        icon: <DeleteOutlined className={classes.actionIcon} />,
        tooltip: t('tooltips.delete_ssa'),
        id: 'deleteSsa',
        onClick: (row) => {
          setDeleteData(row)
          toggle()
        },
      })
    }

    return list
  }, [
    canReadSsa,
    canWriteSsa,
    canDeleteSsa,
    t,
    handleViewSsa,
    handleDownloadSsa,
    classes.actionIcon,
    toggle,
  ])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [pageNumber, limit, totalItems, LIMIT_OPTIONS, handlePageChange, handleRowsPerPageChange],
  )

  const getRowKey = useCallback(
    (row: SsaTableRowData, index: number) => row.id ?? `ssa-${index}`,
    [],
  )

  const searchLabel = useMemo(() => `${t('fields.search')}:`, [t])
  const searchPlaceholder = useMemo(() => t('placeholders.search_pattern'), [t])

  const primaryAction = useMemo(
    () =>
      canWriteSsa
        ? {
            label: t('messages.add_ssa'),
            icon: <Add className={classes.addIcon} />,
            onClick: handleGoToSsaAddPage,
          }
        : undefined,
    [canWriteSsa, t, handleGoToSsaAddPage, classes.addIcon],
  )

  const emptyMessage = useMemo(() => t('messages.no_data_available'), [t])

  const renderExpandedRow = useCallback(
    (row: SsaTableRowData) => <SsaDetailViewPage row={row} />,
    [],
  )

  return (
    <GluuLoader blocking={loading || isDeleting}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadSsa}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={searchLabel}
                searchPlaceholder={searchPlaceholder}
                searchValue={pattern}
                searchOnType
                onSearch={setPattern}
                onRefresh={canReadSsa ? handleRefresh : undefined}
                primaryAction={primaryAction}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<SsaTableRowData>
              columns={columns}
              data={filteredRows}
              loading={false}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
              expandable
              renderExpandedRow={renderExpandedRow}
            />
          </div>
        </GluuViewWrapper>

        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          feature={adminUiFeatures.ssa_delete}
          label={
            modal && deleteData
              ? `${t('messages.action_deletion_for')} ${t('messages.ssa_entity')} (${[deleteData.ssa.software_id, deleteData.ssa.org_id].filter(Boolean).join(' - ')})`
              : ''
          }
        />

        {ssaDialogOpen && (
          <JsonViewerDialog
            isOpen={ssaDialogOpen}
            toggle={toggleSsaDialog}
            data={jwtData}
            isLoading={getSsaJwtMutation.isPending}
            title={t('titles.json_view')}
            theme={selectedTheme}
            expanded={true}
          />
        )}
      </div>
    </GluuLoader>
  )
}

SsaListPage.displayName = 'SsaListPage'

export default React.memo(SsaListPage)
