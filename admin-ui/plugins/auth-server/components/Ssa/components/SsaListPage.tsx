import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { DeleteOutlined, DownloadOutlined, VisibilityOutlined, Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import SetTitle from 'Utils/SetTitle'
import { SSA } from 'Utils/ApiResources'
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
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import { BORDER_RADIUS } from '@/constants'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { GluuBadge } from '@/components/GluuBadge'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import JsonViewerDialog from '../../JsonViewer/JsonViewerDialog'
import { useStyles } from './styles/SsaListPage.style'
import { useQueryClient } from '@tanstack/react-query'
import { devLogger } from '@/utils/devLogger'
import { useGetAllSsas, useGetSsaJwt, useRevokeSsaWithAudit, SSA_QUERY_KEYS } from '../hooks'
import { formatExpirationDate } from '../utils'
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
  const viewSsaJwtMutation = useGetSsaJwt()
  const downloadSsaJwtMutation = useGetSsaJwt()
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
  const { classes, cx } = useStyles({ isDark, themeColors })

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
        const fetchedJwtData = await viewSsaJwtMutation.mutateAsync(row.ssa.jti)
        setJwtData(fetchedJwtData)
      } catch (error) {
        devLogger.error('Failed to fetch SSA JWT:', error)
        dispatch(updateToast(true, 'error'))
        setSsaDialogOpen(false)
      }
    },
    [viewSsaJwtMutation, dispatch],
  )

  const handleDownloadSsa = useCallback(
    async (row: SsaTableRowData): Promise<void> => {
      try {
        const jwtResponse = await downloadSsaJwtMutation.mutateAsync(row.ssa.jti)
        downloadJwtFile(jwtResponse.ssa, row.ssa.software_id)
      } catch (error) {
        devLogger.error('Failed to download SSA JWT:', error)
        dispatch(updateToast(true, 'error'))
      }
    },
    [downloadSsaJwtMutation, dispatch],
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
        devLogger.error('Delete SSA failed:', error)
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

  const getStatusMeta = useCallback(
    (status: string | null | undefined) => {
      const normalizedStatus = status?.trim().toLowerCase()

      if (normalizedStatus === 'active') {
        return {
          label: t('options.active'),
          badgeClassName: cx(classes.statusBadge, classes.filledBadge),
          badgeBackgroundColor: themeColors.badges.filledBadgeBg,
          badgeTextColor: themeColors.badges.filledBadgeText,
        }
      }

      if (normalizedStatus === 'inactive') {
        return {
          label: t('options.inactive'),
          badgeClassName: cx(classes.statusBadge, classes.disabledBadge),
          badgeBackgroundColor: themeColors.badges.disabledBg,
          badgeTextColor: themeColors.badges.disabledText,
        }
      }

      return {
        label: status || '',
        badgeClassName: cx(classes.statusBadge, classes.disabledBadge),
        badgeBackgroundColor: themeColors.badges.disabledBg,
        badgeTextColor: themeColors.badges.disabledText,
      }
    },
    [
      classes.disabledBadge,
      classes.filledBadge,
      classes.statusBadge,
      cx,
      t,
      themeColors.badges.disabledBg,
      themeColors.badges.disabledText,
      themeColors.badges.filledBadgeBg,
      themeColors.badges.filledBadgeText,
    ],
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
          render: (value) => {
            const { label, badgeClassName } = getStatusMeta(String(value))

            return (
              <GluuBadge size="md" borderRadius={BORDER_RADIUS.SMALL} className={badgeClassName}>
                {label}
              </GluuBadge>
            )
          },
        },
        {
          key: 'expiration',
          label: t('fields.expiration'),
          render: (value) => formatExpirationDate(value as number),
        },
      ] as ColumnDef<SsaTableRowData>[],
    [t, getStatusMeta],
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
  const detailLabelStyle = useMemo(
    () => ({ color: themeColors.fontColor }),
    [themeColors.fontColor],
  )

  const getDetailFields = useCallback(
    (row: SsaTableRowData): GluuDetailGridField[] => {
      const statusMeta = getStatusMeta(row.status)

      return [
        {
          label: 'fields.software_id',
          value: row.ssa.software_id || null,
          doc_entry: 'software_id',
          doc_category: SSA,
        },
        {
          label: 'fields.description',
          value: row.ssa.description || null,
          doc_entry: 'description',
          doc_category: SSA,
        },
        {
          label: 'fields.status',
          value: statusMeta.label || null,
          doc_entry: 'status',
          doc_category: SSA,
          isBadge: true,
          badgeBackgroundColor: statusMeta.badgeBackgroundColor,
          badgeTextColor: statusMeta.badgeTextColor,
        },
        {
          label: 'fields.one_time_use',
          value: row.ssa.one_time_use ? t('options.true') : t('options.false'),
          doc_entry: 'one_time_use',
          doc_category: SSA,
          isBadge: true,
          badgeBackgroundColor: row.ssa.one_time_use
            ? themeColors.badges.filledBadgeBg
            : themeColors.badges.disabledBg,
          badgeTextColor: row.ssa.one_time_use
            ? themeColors.badges.filledBadgeText
            : themeColors.badges.disabledText,
        },
        {
          label: 'fields.rotate_ssa',
          value: row.ssa.rotate_ssa ? t('options.true') : t('options.false'),
          doc_entry: 'rotate_ssa',
          doc_category: SSA,
          isBadge: true,
          badgeBackgroundColor: row.ssa.rotate_ssa
            ? themeColors.badges.filledBadgeBg
            : themeColors.badges.disabledBg,
          badgeTextColor: row.ssa.rotate_ssa
            ? themeColors.badges.filledBadgeText
            : themeColors.badges.disabledText,
        },
        {
          label: 'fields.organization',
          value: row.ssa.org_id || null,
          doc_entry: 'org_id',
          doc_category: SSA,
        },
        {
          label: 'fields.expiration',
          value: formatExpirationDate(row.expiration),
          doc_entry: 'expiration',
          doc_category: SSA,
        },
        {
          label: 'fields.grant_types',
          value: row.ssa.grant_types?.join(', ') || null,
          doc_entry: 'grant_types',
          doc_category: SSA,
          isBadge: true,
          badgeBackgroundColor: themeColors.badges.statusActiveBg,
          badgeTextColor: themeColors.badges.statusActive,
        },
      ]
    },
    [getStatusMeta, t, themeColors],
  )

  const renderExpandedRow = useCallback(
    (row: SsaTableRowData) => (
      <GluuDetailGrid
        fields={getDetailFields(row)}
        labelStyle={detailLabelStyle}
        defaultDocCategory={SSA}
        layout="column"
      />
    ),
    [detailLabelStyle, getDetailFields],
  )

  return (
    <GluuLoader blocking={loading || isDeleting || downloadSsaJwtMutation.isPending}>
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
            isLoading={viewSsaJwtMutation.isPending}
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
