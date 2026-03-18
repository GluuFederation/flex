import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from 'react'
import { DeleteOutlined, Edit, Add, VisibilityOutlined } from '@mui/icons-material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { GluuBadge } from '@/components/GluuBadge'
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { useQueryClient } from '@tanstack/react-query'
import { useAttributes, useDeleteAttribute, useMutationEffects, toAttributeList } from '../../hooks'
import { API_ATTRIBUTE } from '../../constants'
import { useStyles } from './styles/UserClaimsListPage.style'
import { getGetAttributesQueryKey } from 'JansConfigApi'
import type { JansAttribute } from 'JansConfigApi'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'

const LIMIT_OPTIONS = getRowsPerPageOptions()

type DisplayValue = string | number | boolean | null | undefined
const displayOrDash = (value: DisplayValue): string =>
  value === null || value === undefined || value === '' ? '—' : String(value)

const attributeResourceId = ADMIN_UI_RESOURCES.Attributes
const attributeScopes = CEDAR_RESOURCE_SCOPES[attributeResourceId] ?? []

const UserClaimsListPage: React.FC = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { navigateToRoute } = useAppNavigation()

  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()

  const theme = useContext(ThemeContext)
  const { themeColors, isDarkTheme } = useMemo(() => {
    const selected = theme?.state?.theme || DEFAULT_THEME
    return {
      themeColors: getThemeColor(selected),
      isDarkTheme: selected === THEME_DARK,
    }
  }, [theme?.state?.theme])
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const detailLabelStyle = useMemo(
    () => ({ color: themeColors.fontColor }),
    [themeColors.fontColor],
  )

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('')

  const [modal, setModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<JansAttribute | null>(null)

  const canRead = useMemo(
    () => hasCedarReadPermission(attributeResourceId),
    [hasCedarReadPermission],
  )
  const canWrite = useMemo(
    () => hasCedarWritePermission(attributeResourceId),
    [hasCedarWritePermission],
  )
  const canDelete = useMemo(
    () => hasCedarDeletePermission(attributeResourceId),
    [hasCedarDeletePermission],
  )

  useEffect(() => {
    if (attributeScopes.length > 0) {
      authorizeHelper(attributeScopes)
    }
  }, [authorizeHelper])

  const startIndex = useMemo(() => pageNumber * limit, [pageNumber, limit])

  const {
    data: attributesData,
    isLoading,
    isError,
    error,
  } = useAttributes({
    limit,
    startIndex,
    ...(pattern && { pattern }),
    ...(status && { status }),
    ...(sortBy && { sortBy, sortOrder: 'ascending' }),
  })

  const attributes = useMemo(() => toAttributeList(attributesData?.entries), [attributesData])
  const totalItems = attributesData?.totalEntriesCount || 0

  const deleteAttributeMutation = useDeleteAttribute()

  useMutationEffects({
    mutation: deleteAttributeMutation,
    successMessage: 'messages.attribute_deleted_successfully',
    errorMessage: 'errors.attribute_delete_failed',
    navigateOnSuccess: false,
  })

  SetTitle(t('titles.all_user_claims'))

  const handleAdd = useCallback(() => {
    navigateToRoute(ROUTES.ATTRIBUTE_ADD)
  }, [navigateToRoute])

  const handleEdit = useCallback(
    (row: JansAttribute) => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.ATTRIBUTE_EDIT(row.inum))
    },
    [navigateToRoute],
  )

  const handleView = useCallback(
    (row: JansAttribute) => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.ATTRIBUTE_VIEW(row.inum))
    },
    [navigateToRoute],
  )

  const handleDeleteClick = useCallback((row: JansAttribute) => {
    setItemToDelete(row)
    setModal(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setModal(false)
    setItemToDelete(null)
  }, [])

  const handleDeleteConfirm = useCallback(
    async (message: string, inum?: string) => {
      if (!inum) return
      try {
        await deleteAttributeMutation.mutateAsync({
          inum,
          name: itemToDelete?.name,
          userMessage:
            message ||
            t('messages.attribute_deleted', { name: itemToDelete?.name ?? itemToDelete?.inum }),
        })
      } finally {
        setModal(false)
        setItemToDelete(null)
      }
    },
    [deleteAttributeMutation, itemToDelete],
  )

  const handleDeleteAccept = useCallback(
    (message: string) => {
      return handleDeleteConfirm(message, itemToDelete?.inum)
    },
    [handleDeleteConfirm, itemToDelete?.inum],
  )

  const deleteDialogLabel = useMemo(
    () =>
      itemToDelete?.inum
        ? `${t('messages.action_deletion_for')} attribute (${itemToDelete.name ?? ''}${itemToDelete.inum ? `-${itemToDelete.inum}` : ''})`
        : '',
    [t, itemToDelete],
  )

  const handleRefresh = useCallback(() => {
    setPattern('')
    setStatus('')
    setSortBy('')
    setPageNumber(0)
    queryClient.removeQueries({ queryKey: getGetAttributesQueryKey() })
  }, [queryClient, setPageNumber])

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
  }, [setPageNumber])

  const handlePatternSearch = useCallback(
    (value: string) => {
      setPattern(value)
      setPageNumber(0)
    },
    [setPageNumber],
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatus(value === 'all' ? '' : value.toUpperCase())
      setPageNumber(0)
    },
    [setPageNumber],
  )

  const handleSortByChange = useCallback(
    (value: string) => {
      setSortBy(value === 'none' ? '' : value)
      setPageNumber(0)
    },
    [setPageNumber],
  )

  const handlePageChange = useCallback((page: number) => setPageNumber(page), [setPageNumber])
  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('options.all') },
      { value: 'active', label: t('options.enabled') },
      { value: 'inactive', label: t('options.disabled') },
    ],
    [t],
  )

  const sortByOptions = useMemo(
    () => [
      { value: 'none', label: t('options.none') },
      { value: 'displayName', label: t('fields.displayname') },
      { value: 'inum', label: t('fields.inum') },
    ],
    [t],
  )

  const filters: FilterDef[] = useMemo(
    () => [
      {
        key: 'status',
        label: `${t('fields.status')}:`,
        value: status ? status.toLowerCase() : 'all',
        options: statusOptions,
        onChange: handleStatusChange,
        width: 140,
      },
      {
        key: 'sortBy',
        label: `${t('fields.sort_by')}:`,
        value: sortBy || 'none',
        options: sortByOptions,
        onChange: handleSortByChange,
        width: 180,
      },
    ],
    [t, status, statusOptions, sortBy, sortByOptions, handleStatusChange, handleSortByChange],
  )

  const primaryAction = useMemo(
    () => ({
      label: t('tooltips.add_attribute'),
      icon: <Add className={classes.addIcon} />,
      onClick: handleAdd,
      disabled: !canWrite,
    }),
    [t, handleAdd, canWrite, classes.addIcon],
  )

  const columns: ColumnDef<JansAttribute>[] = useMemo(
    () => [
      {
        key: 'inum',
        label: t('fields.inum'),
        sortable: true,
        render: (_value, row) => <span className={classes.cellText}>{row.inum}</span>,
      },
      {
        key: 'displayName',
        label: t('fields.displayname'),
        sortable: true,
        render: (_value, row) => <span className={classes.cellText}>{row.displayName}</span>,
      },
      {
        key: 'status',
        label: t('fields.status'),
        sortable: false,
        render: (_value, row) => {
          const isActive = row.status?.toLowerCase() === 'active'
          const style = isActive ? badgeStyles.statusEnabledBadge : badgeStyles.statusDisabledBadge
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={6}
              className={classes.statusBadge}
            >
              {isActive ? t('options.enabled') : t('options.disabled')}
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
      onClick: (row: JansAttribute) => void
    }> = []

    if (canWrite) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('tooltips.edit_attribute'),
        id: 'editAttribute',
        onClick: handleEdit,
      })
    }
    if (canRead) {
      list.push({
        icon: <VisibilityOutlined className={classes.viewIcon} />,
        tooltip: t('tooltips.view_attribute'),
        id: 'viewAttribute',
        onClick: handleView,
      })
    }
    if (canDelete) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('tooltips.delete_attribute'),
        id: 'deleteAttribute',
        onClick: handleDeleteClick,
      })
    }
    return list
  }, [canWrite, canRead, canDelete, t, handleEdit, handleView, handleDeleteClick, classes])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [pageNumber, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const getRowKey = useCallback(
    (row: JansAttribute, index: number) => row.inum ?? `no-inum-${index}`,
    [],
  )

  const getAttributeDetailFields = useCallback(
    (row: JansAttribute): GluuDetailGridField[] => {
      const isActive = row.status?.toLowerCase() === 'active'
      const editTypeArr = Array.isArray(row.editType) ? row.editType : []
      const viewTypeArr = Array.isArray(row.viewType) ? row.viewType : []
      return [
        {
          label: 'fields.name',
          value: displayOrDash(row.name),
          doc_entry: 'name',
          doc_category: API_ATTRIBUTE,
        },
        {
          label: 'fields.displayname',
          value: displayOrDash(row.displayName),
          doc_entry: 'displayName',
          doc_category: API_ATTRIBUTE,
        },
        {
          label: 'fields.status',
          value: isActive ? t('options.enabled') : t('options.disabled'),
          doc_entry: 'status',
          doc_category: API_ATTRIBUTE,
          isBadge: true,
          badgeBackgroundColor: isActive
            ? themeColors.badges.statusActiveBg
            : themeColors.badges.disabledBg,
          badgeTextColor: isActive
            ? themeColors.badges.statusActive
            : themeColors.badges.disabledText,
        },
        {
          label: 'fields.attribute_edit_type',
          value: editTypeArr.length > 0 ? editTypeArr.join(', ') : '—',
          doc_entry: 'editType',
          doc_category: API_ATTRIBUTE,
          isBadge: editTypeArr.length > 0,
          badgeBackgroundColor: themeColors.badges.filledBadgeBg,
          badgeTextColor: themeColors.badges.filledBadgeText,
        },
        {
          label: 'fields.attribute_view_type',
          value: viewTypeArr.length > 0 ? viewTypeArr.join(', ') : '—',
          doc_entry: 'viewType',
          doc_category: API_ATTRIBUTE,
          isBadge: viewTypeArr.length > 0,
          badgeBackgroundColor: themeColors.badges.filledBadgeBg,
          badgeTextColor: themeColors.badges.filledBadgeText,
        },
        {
          label: 'fields.description',
          value: displayOrDash(row.description),
          doc_entry: 'description',
          doc_category: API_ATTRIBUTE,
          fullWidth: true,
        },
      ]
    },
    [t, themeColors],
  )

  const renderExpandedRow = useCallback(
    (row: JansAttribute) => (
      <GluuDetailGrid
        fields={getAttributeDetailFields(row)}
        labelStyle={detailLabelStyle}
        defaultDocCategory={API_ATTRIBUTE}
        layout="column"
      />
    ),
    [getAttributeDetailFields, detailLabelStyle],
  )

  const loading = useMemo(
    () => isLoading || deleteAttributeMutation.isPending,
    [isLoading, deleteAttributeMutation.isPending],
  )

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canRead}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t('fields.pattern')}:`}
                searchPlaceholder={t('placeholders.search_pattern')}
                searchValue={pattern}
                searchOnType
                onSearch={handlePatternSearch}
                onSearchSubmit={handleSearchSubmit}
                filters={filters}
                onRefresh={canRead ? handleRefresh : undefined}
                refreshLoading={isLoading}
                primaryAction={primaryAction}
                disabled={loading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<JansAttribute>
              columns={columns}
              data={attributes}
              loading={false}
              expandable
              renderExpandedRow={renderExpandedRow}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={
                isError
                  ? t('errors.fetch_failed', {
                      detail: error instanceof Error ? error.message : '',
                    })
                  : t('messages.no_data')
              }
            />
          </div>
        </GluuViewWrapper>

        {canDelete && itemToDelete?.inum && (
          <GluuCommitDialog
            handler={handleCloseDeleteModal}
            modal={modal}
            onAccept={handleDeleteAccept}
            label={deleteDialogLabel}
            feature={adminUiFeatures.attributes_delete}
            autoCloseOnAccept
          />
        )}
      </div>
    </GluuLoader>
  )
}

export default memo(UserClaimsListPage)
