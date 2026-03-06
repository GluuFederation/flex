import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { DeleteOutlined, Edit, Add } from '@mui/icons-material'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuBadge } from '@/components/GluuBadge'
import { useCedarling } from '@/cedarling'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { setSelectedAsset } from 'Plugins/admin/redux/features/AssetSlice'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAllAssets, getGetAllAssetsQueryKey, type Document } from 'JansConfigApi'
import { useDeleteAssetWithAudit } from './hooks'
import { formatDate } from '@/utils/dayjsUtils'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import customColors from '@/customColors'
import { useStyles } from './JansAssetListPage.style'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'
import { T_KEYS } from './constants'

const LIMIT_OPTIONS = getRowsPerPageOptions()
const ASSET_RESOURCE_ID = ADMIN_UI_RESOURCES.Assets
const ASSET_SCOPES = CEDAR_RESOURCE_SCOPES[ASSET_RESOURCE_ID] ?? []

const JansAssetListPage: React.FC = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { navigateToRoute } = useAppNavigation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDarkTheme = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark: isDarkTheme, themeColors })
  const badgeStyles = useMemo(
    () => ({
      statusBadgeEnabled: {
        backgroundColor: customColors.statusActive,
        textColor: customColors.white,
        borderColor: 'transparent',
      },
      statusBadgeDisabled: {
        backgroundColor: isDarkTheme
          ? customColors.disabledBadgeDarkBg
          : customColors.disabledBadgeLightBg,
        textColor: isDarkTheme
          ? customColors.disabledBadgeDarkText
          : customColors.disabledBadgeLightText,
        borderColor: 'transparent',
      },
    }),
    [isDarkTheme],
  )

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState<Document | null>(null)

  SetTitle(t(T_KEYS.TITLE_ASSETS))

  const canReadAssets = useMemo(
    () => hasCedarReadPermission(ASSET_RESOURCE_ID),
    [hasCedarReadPermission],
  )
  const canWriteAssets = useMemo(
    () => hasCedarWritePermission(ASSET_RESOURCE_ID),
    [hasCedarWritePermission],
  )
  const canDeleteAssets = useMemo(
    () => hasCedarDeletePermission(ASSET_RESOURCE_ID),
    [hasCedarDeletePermission],
  )

  const { data, isLoading, isFetching, refetch } = useGetAllAssets(
    {
      limit,
      pattern: pattern || undefined,
      startIndex: pageNumber * limit,
    },
    {
      query: {
        enabled: canReadAssets,
      },
    },
  )

  const assets = useMemo(() => data?.entries ?? [], [data])
  const totalItems = useMemo(() => data?.totalEntriesCount ?? 0, [data])

  const effectivePage = useMemo(() => {
    const maxPage = totalItems > 0 ? Math.max(0, Math.ceil(totalItems / limit) - 1) : 0
    return Math.min(pageNumber, maxPage)
  }, [pageNumber, totalItems, limit])

  useEffect(() => {
    if (totalItems > 0 && pageNumber > effectivePage) {
      setPageNumber(effectivePage)
    }
  }, [totalItems, pageNumber, limit, effectivePage, setPageNumber])

  useEffect(() => {
    if (ASSET_SCOPES.length > 0) {
      authorizeHelper(ASSET_SCOPES)
    }
  }, [authorizeHelper])

  const { deleteAsset, isLoading: isDeleting } = useDeleteAssetWithAudit()

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const navigateToAddPage = useCallback(() => {
    dispatch(setSelectedAsset({}))
    navigateToRoute(ROUTES.ASSET_ADD)
  }, [dispatch, navigateToRoute])

  const navigateToEditPage = useCallback(
    (rowData: Document) => {
      if (!rowData?.inum) return
      dispatch(setSelectedAsset(rowData))
      navigateToRoute(ROUTES.ASSET_EDIT(rowData.inum))
    },
    [dispatch, navigateToRoute],
  )

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
    refetch()
  }, [refetch])

  const handleRefresh = useCallback(() => {
    setPageNumber(0)
    setPattern('')
    const refreshParams = { limit, pattern: undefined, startIndex: 0 }
    invalidateQueriesByKey(queryClient, getGetAllAssetsQueryKey(refreshParams))
  }, [queryClient, limit])

  const handlePageChange = useCallback(
    (page: number) => {
      setPageNumber(page)
    },
    [setPageNumber],
  )

  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  const submitForm = useCallback(
    async (userMessage: string) => {
      const inumToDelete = deleteData?.inum
      if (inumToDelete) {
        try {
          await deleteAsset(inumToDelete, userMessage)
          refetch()
          setDeleteData(null)
        } catch (err) {
          devLogger.error('[Asset delete] submitForm failed', err)
        }
      }
    },
    [deleteData, deleteAsset, refetch, setDeleteData],
  )

  const searchLabel = useMemo(() => `${t(T_KEYS.FIELD_PATTERN)}:`, [t])
  const searchPlaceholder = useMemo(() => t(T_KEYS.PLACEHOLDER_SEARCH_PATTERN), [t])

  const primaryAction = useMemo(
    () =>
      canWriteAssets
        ? {
            label: t(T_KEYS.MSG_ADD_ASSET),
            icon: <Add className={classes.addIcon} />,
            onClick: navigateToAddPage,
          }
        : undefined,
    [t, navigateToAddPage, canWriteAssets, classes],
  )

  const columns: ColumnDef<Document>[] = useMemo(
    () => [
      {
        key: 'fileName',
        label: t(T_KEYS.FIELD_NAME),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellFileName}>
            {row.fileName}
          </GluuText>
        ),
      },
      {
        key: 'description',
        label: t(T_KEYS.FIELD_DESCRIPTION),
        width: '35%',
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellDescription}>
            {row.description}
          </GluuText>
        ),
      },
      {
        key: 'creationDate',
        label: t(T_KEYS.FIELD_CREATION_DATE),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellDate}>
            {row.creationDate ? formatDate(row.creationDate, 'YYYY-MM-DD') : ''}
          </GluuText>
        ),
      },
      {
        key: 'enabled',
        label: t(T_KEYS.FIELD_ENABLED),
        sortable: true,
        render: (_value, row) => {
          const isEnabled = row.enabled === true
          const style = isEnabled ? badgeStyles.statusBadgeEnabled : badgeStyles.statusBadgeDisabled
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={5}
              className={classes.statusBadge}
            >
              {isEnabled ? t('options.enabled') : t('options.disabled')}
            </GluuBadge>
          )
        },
      },
    ],
    [t, classes, badgeStyles],
  )

  const actions = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode
      tooltip: string
      id?: string
      onClick: (row: Document) => void
    }> = []
    if (canWriteAssets) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t(T_KEYS.ACTION_EDIT),
        id: 'editAsset',
        onClick: navigateToEditPage,
      })
    }
    if (canDeleteAssets) {
      list.push({
        icon: <DeleteOutlined className={classes.editIcon} />,
        tooltip: t(T_KEYS.ACTION_DELETE),
        id: 'deleteAsset',
        onClick: (row) => {
          setDeleteData(row)
          toggle()
        },
      })
    }
    return list
  }, [canWriteAssets, canDeleteAssets, t, navigateToEditPage, toggle, classes])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: effectivePage,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [effectivePage, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const getRowKey = useCallback(
    (row: Document, index: number) => row.inum ?? `no-inum-${index}`,
    [],
  )

  const emptyMessage = useMemo(() => {
    if (!pattern && totalItems === 0) {
      return t(T_KEYS.MSG_NO_ASSETS_FOUND)
    }
    return t(T_KEYS.MSG_NO_DATA)
  }, [pattern, totalItems, t])

  const loading = isLoading || isFetching || isDeleting

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadAssets}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={searchLabel}
                searchPlaceholder={searchPlaceholder}
                searchValue={pattern}
                searchOnType
                onSearch={setPattern}
                onSearchSubmit={handleSearchSubmit}
                onRefresh={canReadAssets ? handleRefresh : undefined}
                primaryAction={primaryAction}
                disabled={loading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<Document>
              columns={columns}
              data={assets || []}
              loading={false}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          label={
            modal && deleteData
              ? `${t(T_KEYS.MSG_ACTION_DELETION_FOR)} ${t(T_KEYS.MSG_ASSET_ENTITY)} (${deleteData.fileName || ''}${deleteData.inum ? `-${deleteData.inum}` : ''})`
              : ''
          }
        />
      </div>
    </GluuLoader>
  )
}

export default memo(JansAssetListPage)
