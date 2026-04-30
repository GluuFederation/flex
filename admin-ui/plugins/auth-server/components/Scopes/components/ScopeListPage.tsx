import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from 'react'
import { DeleteOutlined, Edit, Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '@/redux/hooks'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuBadge } from '@/components/GluuBadge'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { updateToast } from 'Redux/features/toastSlice'
import { triggerWebhook } from 'Plugins/admin/redux/features/WebhookSlice'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteOauthScopesByInum } from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'
import type { ScopeTableRow } from '../types'
import { devLogger } from '@/utils/devLogger'
import { useScopes, useScopeActions, invalidateScopeQueries } from '../hooks'
import { toScopeJsonRecord } from '../helper/utils'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useDebounce } from '@/utils/hooks/useDebounce'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import { SCOPE } from 'Utils/ApiResources'
import { useStyles } from './styles/ScopeListPage.style'
import {
  SCOPE_SORT_COLUMNS,
  SCOPE_SORT_COLUMN_LABELS,
  SCOPE_TYPE_OPTIONS,
  DEFAULT_SCOPE_SORT_BY,
  FEATURE_SCOPE_DELETE,
  EMPTY_PLACEHOLDER,
} from '../constants'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'

const LIMIT_OPTIONS = getRowsPerPageOptions()

const getScopeTypeBadgeStyle = (
  scopeTypeBadge: Record<
    string,
    { backgroundColor: string; textColor: string; borderColor: string }
  >,
  scopeType?: string,
) => {
  const key = scopeType?.toLowerCase() ?? 'default'
  return scopeTypeBadge[key] ?? scopeTypeBadge.default
}

type DisplayValue = GluuDetailGridField['value']

const displayOrDash = (value: DisplayValue): DisplayValue =>
  value === null || value === undefined || value === '' ? EMPTY_PLACEHOLDER : value

const ScopeListPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { navigateToRoute } = useAppNavigation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const { logScopeDeletion } = useScopeActions()

  const theme = useContext(ThemeContext)
  const { themeColors, isDarkTheme } = useMemo(() => {
    const selected = theme?.state?.theme || DEFAULT_THEME
    return {
      themeColors: getThemeColor(selected),
      isDarkTheme: selected === THEME_DARK,
    }
  }, [theme?.state?.theme])
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [scopeType, setScopeType] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SCOPE_SORT_BY)

  const [modal, setModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Scope | null>(null)

  const scopesResourceId = ADMIN_UI_RESOURCES.Scopes
  const scopesScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[scopesResourceId] ?? [],
    [scopesResourceId],
  )

  const canRead = useMemo(
    () => hasCedarReadPermission(scopesResourceId),
    [hasCedarReadPermission, scopesResourceId],
  )
  const canWrite = useMemo(
    () => hasCedarWritePermission(scopesResourceId),
    [hasCedarWritePermission, scopesResourceId],
  )
  const canDelete = useMemo(
    () => hasCedarDeletePermission(scopesResourceId),
    [hasCedarDeletePermission, scopesResourceId],
  )

  useEffect(() => {
    authorizeHelper(scopesScopes)
  }, [authorizeHelper, scopesScopes])

  const startIndex = useMemo(() => pageNumber * limit, [pageNumber, limit])

  const debouncedPattern = useDebounce(pattern, 400)

  const scopesQueryParams = useMemo(
    () => ({
      limit,
      startIndex,
      ...(debouncedPattern && { pattern: debouncedPattern }),
      ...(scopeType && { type: scopeType }),
      ...(sortBy && { sortBy, sortOrder: 'ascending' as const }),
      withAssociatedClients: true as const,
    }),
    [limit, startIndex, debouncedPattern, scopeType, sortBy],
  )

  const { data: scopesResponse, isLoading, refetch } = useScopes(scopesQueryParams)

  const deleteScope = useDeleteOauthScopesByInum({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.scope_deleted_successfully')))
        invalidateScopeQueries(queryClient)
      },
      onError: (error: Error) => {
        const errorMessage = error?.message || t('messages.error_deleting_scope')
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const { scopes, totalItems } = useMemo(
    () => ({
      scopes: (scopesResponse?.entries || []) as ScopeTableRow[],
      totalItems: scopesResponse?.totalEntriesCount ?? 0,
    }),
    [scopesResponse],
  )

  SetTitle(t('titles.scopes'))

  // Navigation handlers
  const handleAdd = useCallback(() => {
    navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_ADD)
  }, [navigateToRoute])

  const handleEdit = useCallback(
    (row: ScopeTableRow) => {
      if (row.inum) {
        navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_EDIT(row.inum))
      }
    },
    [navigateToRoute],
  )

  // Delete handlers
  const handleDeleteClick = useCallback((row: ScopeTableRow) => {
    setItemToDelete(row as Scope)
    setModal(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setModal(false)
    setItemToDelete(null)
  }, [])

  const handleDeleteConfirm = useCallback(
    async (message: string) => {
      if (!itemToDelete?.inum) return

      try {
        await deleteScope.mutateAsync({ inum: itemToDelete.inum })
        dispatch(
          triggerWebhook({
            createdFeatureValue: toScopeJsonRecord(itemToDelete),
            feature: adminUiFeatures.scopes_delete,
          }),
        )
        await logScopeDeletion(itemToDelete, message)
        setModal(false)
        setItemToDelete(null)
      } catch (error) {
        devLogger.error('Error deleting scope:', error instanceof Error ? error : String(error))
      }
    },
    [itemToDelete, deleteScope, logScopeDeletion, dispatch],
  )

  // Filter/search handlers
  const handlePatternSearch = useCallback(
    (value: string) => {
      setPattern(value)
      setPageNumber(0)
    },
    [setPageNumber],
  )

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
  }, [setPageNumber])

  const handleRefresh = useCallback(() => {
    setPattern('')
    setScopeType('')
    setSortBy(DEFAULT_SCOPE_SORT_BY)
    setPageNumber(0)
    refetch()
  }, [refetch, setPageNumber])

  const handleScopeTypeChange = useCallback(
    (value: string) => {
      setScopeType(value)
      setPageNumber(0)
    },
    [setPageNumber],
  )

  const handleSortByChange = useCallback(
    (value: string) => {
      setSortBy(value)
      setPageNumber(0)
    },
    [setPageNumber],
  )

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

  // Filter definitions
  const scopeTypeOptions = useMemo(
    () => [
      { value: '', label: t('options.all') },
      ...SCOPE_TYPE_OPTIONS,
      { value: 'spontaneous', label: 'Spontaneous' },
    ],
    [t],
  )

  const sortOptions = useMemo(
    () => [
      { value: '', label: t('options.none') },
      ...SCOPE_SORT_COLUMNS.map((value) => ({
        value,
        label: t(SCOPE_SORT_COLUMN_LABELS[value] || value),
      })),
    ],
    [t],
  )

  const filters: FilterDef[] = useMemo(
    () => [
      {
        key: 'scopeType',
        label: `${t('fields.scope_type')}:`,
        value: scopeType,
        options: scopeTypeOptions,
        onChange: handleScopeTypeChange,
        width: 180,
      },
      {
        key: 'sortBy',
        label: `${t('fields.sort_by')}:`,
        value: sortBy,
        options: sortOptions,
        onChange: handleSortByChange,
        width: 180,
      },
    ],
    [
      t,
      scopeType,
      scopeTypeOptions,
      sortBy,
      sortOptions,
      handleScopeTypeChange,
      handleSortByChange,
    ],
  )

  const searchLabel = useMemo(() => `${t('fields.pattern')}:`, [t])
  const searchPlaceholder = useMemo(() => t('placeholders.search_pattern'), [t])

  const primaryAction = useMemo(
    () => ({
      label: t('messages.add_scope'),
      icon: <Add className={classes.addIcon} />,
      onClick: handleAdd,
      disabled: !canWrite,
    }),
    [t, handleAdd, canWrite, classes],
  )

  // Table columns
  const columns: ColumnDef<ScopeTableRow>[] = useMemo(
    () => [
      {
        key: 'id',
        label: t('fields.id'),
        sortable: true,
      },
      {
        key: 'dn',
        label: t('menus.clients'),
        render: (_value, row) => {
          if (!row.clients || !row.inum) {
            return row.clients?.length || 0
          }
          return (
            <Link
              to={ROUTES.AUTH_SERVER_CLIENTS_LIST_WITH_SCOPE(row.inum)}
              className={classes.clientsLink}
            >
              {row.clients.length}
            </Link>
          )
        },
      },
      {
        key: 'description',
        label: t('fields.description'),
        sortable: true,
        width: '35%',
        render: (_value, row) => {
          const desc = row.description ?? EMPTY_PLACEHOLDER
          return (
            <GluuText
              variant="span"
              disableThemeColor
              className={classes.cellDescription}
              title={typeof desc === 'string' ? desc : undefined}
            >
              {desc}
            </GluuText>
          )
        },
      },
      {
        key: 'scopeType',
        label: t('fields.scope_type'),
        sortable: true,
        render: (_value, row) => {
          const style = getScopeTypeBadgeStyle(badgeStyles.scopeTypeBadge, row.scopeType)
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={6}
              className={classes.scopeTypeBadge}
            >
              {row.scopeType}
            </GluuBadge>
          )
        },
      },
    ],
    [t, classes, badgeStyles],
  )

  // Table actions
  const actions = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode
      tooltip: string
      id?: string
      onClick: (row: ScopeTableRow) => void
    }> = []
    if (canWrite) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('messages.edit_scope'),
        id: 'editScope',
        onClick: handleEdit,
      })
    }
    if (canDelete) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('messages.delete_scope'),
        id: 'deleteScope',
        onClick: handleDeleteClick,
      })
    }
    return list
  }, [canWrite, canDelete, t, handleEdit, handleDeleteClick, classes])

  // Pagination
  const effectivePage = useMemo(() => {
    const maxPage = totalItems > 0 ? Math.max(0, Math.ceil(totalItems / limit) - 1) : 0
    return Math.min(pageNumber, maxPage)
  }, [pageNumber, totalItems, limit])

  useEffect(() => {
    if (totalItems > 0 && pageNumber > effectivePage) {
      setPageNumber(effectivePage)
    }
  }, [totalItems, pageNumber, limit, effectivePage])

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
    (row: ScopeTableRow, index: number) => row.inum ?? `no-inum-${index}`,
    [],
  )

  // Expandable row detail
  const detailLabelStyle = useMemo(
    () => ({ color: themeColors.fontColor }),
    [themeColors.fontColor],
  )

  const getScopeDetailFields = useCallback(
    (row: ScopeTableRow): GluuDetailGridField[] => [
      {
        label: 'fields.inum',
        value: displayOrDash(row.inum),
        doc_entry: 'inum',
        doc_category: SCOPE,
      },
      {
        label: 'fields.id',
        value: displayOrDash(row.id),
        doc_entry: 'id',
        doc_category: SCOPE,
      },
      {
        label: 'fields.description',
        value: displayOrDash(row.description),
        doc_entry: 'description',
        doc_category: SCOPE,
      },
      {
        label: 'fields.displayname',
        value: displayOrDash(row.displayName),
        doc_entry: 'displayName',
        doc_category: SCOPE,
      },
      {
        label: 'fields.scope_type',
        value: displayOrDash(row.scopeType),
        doc_entry: 'scopeType',
        doc_category: SCOPE,
        isBadge: true,
        badgeBackgroundColor: getScopeTypeBadgeStyle(badgeStyles.scopeTypeBadge, row.scopeType)
          .backgroundColor,
        badgeTextColor: getScopeTypeBadgeStyle(badgeStyles.scopeTypeBadge, row.scopeType).textColor,
      },
      {
        label: 'fields.default_scope',
        value:
          typeof row.defaultScope === 'boolean'
            ? row.defaultScope
              ? t('options.yes')
              : t('options.no')
            : EMPTY_PLACEHOLDER,
        doc_entry: 'defaultScope',
        doc_category: SCOPE,
        isBadge: typeof row.defaultScope === 'boolean',
        badgeBackgroundColor:
          typeof row.defaultScope === 'boolean'
            ? row.defaultScope
              ? badgeStyles.trueBadge.backgroundColor
              : badgeStyles.falseBadge.backgroundColor
            : undefined,
        badgeTextColor:
          typeof row.defaultScope === 'boolean'
            ? row.defaultScope
              ? badgeStyles.trueBadge.textColor
              : badgeStyles.falseBadge.textColor
            : undefined,
      },
      {
        label: 'fields.show_in_configuration_endpoint',
        value:
          typeof row.attributes?.showInConfigurationEndpoint === 'boolean'
            ? row.attributes.showInConfigurationEndpoint
              ? t('options.yes')
              : t('options.no')
            : EMPTY_PLACEHOLDER,
        doc_entry: 'attributes.showInConfigurationEndpoint',
        doc_category: SCOPE,
        isBadge: typeof row.attributes?.showInConfigurationEndpoint === 'boolean',
        badgeBackgroundColor:
          typeof row.attributes?.showInConfigurationEndpoint === 'boolean'
            ? row.attributes.showInConfigurationEndpoint
              ? badgeStyles.trueBadge.backgroundColor
              : badgeStyles.falseBadge.backgroundColor
            : undefined,
        badgeTextColor:
          typeof row.attributes?.showInConfigurationEndpoint === 'boolean'
            ? row.attributes.showInConfigurationEndpoint
              ? badgeStyles.trueBadge.textColor
              : badgeStyles.falseBadge.textColor
            : undefined,
      },
      {
        label: 'fields.attributes',
        value: displayOrDash(
          row.attributes
            ? Object.entries(row.attributes)
                .filter(([, v]) => v !== undefined && v !== null)
                .map(([k, v]) => `${k}: ${String(v)}`)
                .join(', ') || null
            : null,
        ),
        doc_entry: 'attributes',
        doc_category: SCOPE,
      },
    ],
    [t, badgeStyles],
  )

  const renderExpandedRow = useCallback(
    (row: ScopeTableRow) => (
      <GluuDetailGrid
        fields={getScopeDetailFields(row)}
        labelStyle={detailLabelStyle}
        defaultDocCategory={SCOPE}
        layout="column"
      />
    ),
    [getScopeDetailFields, detailLabelStyle],
  )

  // Delete dialog
  const deleteDialogLabel = useMemo(
    () =>
      itemToDelete
        ? `${t('messages.action_deletion_for')} ${t('messages.subject_scope')} (${itemToDelete.id ?? ''}${itemToDelete.inum ? `-${itemToDelete.inum}` : ''})`
        : '',
    [t, itemToDelete],
  )

  const emptyMessage = useMemo(() => {
    if (!pattern && scopes.length === 0) {
      return t('messages.no_scopes_found')
    }
    return t('messages.no_data')
  }, [pattern, scopes.length, t])

  const loading = useMemo(
    () => isLoading || deleteScope.isPending,
    [isLoading, deleteScope.isPending],
  )

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canRead}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={searchLabel}
                searchPlaceholder={searchPlaceholder}
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
            <GluuTable<ScopeTableRow>
              columns={columns}
              data={scopes}
              loading={false}
              expandable
              renderExpandedRow={renderExpandedRow}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>

        {canDelete && itemToDelete && (
          <GluuCommitDialog
            handler={handleCloseDeleteModal}
            modal={modal}
            onAccept={handleDeleteConfirm}
            label={deleteDialogLabel}
            feature={FEATURE_SCOPE_DELETE}
            autoCloseOnAccept
          />
        )}
      </div>
    </GluuLoader>
  )
}

export default memo(ScopeListPage)
