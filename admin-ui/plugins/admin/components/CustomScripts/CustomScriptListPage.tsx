import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from 'react'
import { DeleteOutlined, Edit, Add, VisibilityOutlined } from '@mui/icons-material'
import { useAppDispatch } from '@/redux/hooks'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuBadge } from '@/components/GluuBadge'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useCedarling, CEDAR_RESOURCE_SCOPES, ADMIN_UI_RESOURCES } from '@/cedarling'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { devLogger } from '@/utils/devLogger'
import { updateToast } from 'Redux/features/toastSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { GluuDetailGrid } from '@/components/GluuDetailGrid'
import { useCustomScriptsByType, useDeleteCustomScript, useCustomScriptTypes } from './hooks'
import { useStyles } from './styles/CustomScriptListPage.style'
import { SCRIPT } from 'Utils/ApiResources'
import type { CustomScript } from 'JansConfigApi'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'
import type { ScriptError } from './types/customScript'
import { DEFAULT_SCRIPT_TYPE } from './constants'

const LIMIT_OPTIONS = getRowsPerPageOptions()

const SORT_COLUMNS = ['inum', 'description', 'scriptType'] as const
const SORT_COLUMN_LABELS: Record<string, string> = {
  inum: 'fields.inum',
  description: 'fields.description',
  scriptType: 'fields.script_type',
}

interface ScriptTableRow extends CustomScript {
  scriptError?: ScriptError
}

const CustomScriptListPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const theme = useContext(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state?.theme || DEFAULT_THEME, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDarkTheme = selectedTheme === THEME_DARK
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState<string>('')
  const [scriptType, setScriptType] = useState<string>(DEFAULT_SCRIPT_TYPE)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')
  const [modal, setModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CustomScript | null>(null)

  const scriptsResourceId = ADMIN_UI_RESOURCES.Scripts
  const scriptScopes = CEDAR_RESOURCE_SCOPES[scriptsResourceId] || []

  const canRead = useMemo(
    () => hasCedarReadPermission(scriptsResourceId),
    [hasCedarReadPermission, scriptsResourceId],
  )
  const canWrite = useMemo(
    () => hasCedarWritePermission(scriptsResourceId),
    [hasCedarWritePermission, scriptsResourceId],
  )
  const canDelete = useMemo(
    () => hasCedarDeletePermission(scriptsResourceId),
    [hasCedarDeletePermission, scriptsResourceId],
  )

  useEffect(() => {
    authorizeHelper(scriptScopes)
  }, [authorizeHelper, scriptScopes])

  const {
    data: scriptsResponse,
    isLoading,
    error,
    refetch,
  } = useCustomScriptsByType(scriptType, {
    pattern: pattern || undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortBy ? sortOrder : undefined,
    limit,
    startIndex: pageNumber * limit + 1,
  })

  const { data: scriptTypes, isLoading: loadingTypes } = useCustomScriptTypes()
  const deleteMutation = useDeleteCustomScript()

  const scripts = (scriptsResponse?.entries || []) as ScriptTableRow[]
  const totalItems = scriptsResponse?.totalEntriesCount ?? 0

  SetTitle(t('titles.scripts'))

  const handleAdd = useCallback(() => {
    navigateToRoute(ROUTES.CUSTOM_SCRIPT_ADD)
  }, [navigateToRoute])

  const handleEdit = useCallback(
    (row: ScriptTableRow) => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.CUSTOM_SCRIPT_EDIT(row.inum))
    },
    [navigateToRoute],
  )

  const handleView = useCallback(
    (row: ScriptTableRow) => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.CUSTOM_SCRIPT_VIEW(row.inum))
    },
    [navigateToRoute],
  )

  const handleDeleteClick = useCallback((row: ScriptTableRow) => {
    setItemToDelete(row)
    setModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(
    async (message: string, inum?: string) => {
      if (!inum) return

      try {
        await deleteMutation.mutateAsync({
          inum,
          actionMessage: message,
        })
        dispatch(updateToast(true, 'success', t('messages.script_deleted_successfully')))
        setModal(false)
        setItemToDelete(null)
      } catch (err) {
        devLogger.error('Failed to delete custom script:', err)
        const errorMessage =
          err instanceof Error ? err.message : t('messages.error_deleting_script')
        dispatch(updateToast(true, 'error', errorMessage))
      }
    },
    [deleteMutation, dispatch, t],
  )

  const handleRefresh = useCallback(() => {
    setPageNumber(0)
    refetch()
  }, [refetch])

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
    refetch()
  }, [refetch])

  const handleTypeChange = useCallback((value: string) => {
    setScriptType(value)
    setPageNumber(0)
  }, [])

  const handleSortByFilter = useCallback((value: string) => {
    setSortBy(value)
    setPageNumber(0)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page)
  }, [])

  const handleRowsPerPageChange = useCallback((rowsPerPage: number) => {
    setLimit(rowsPerPage)
    setPageNumber(0)
  }, [])

  const handleSort = useCallback((columnKey: string, direction: 'asc' | 'desc' | null) => {
    setSortBy(direction ? columnKey : '')
    setSortOrder(direction === 'desc' ? 'descending' : 'ascending')
    setPageNumber(0)
  }, [])

  const sortOptions = useMemo(
    () => [
      { value: '', label: t('options.none') },
      ...SORT_COLUMNS.map((value) => ({
        value,
        label: t(SORT_COLUMN_LABELS[value] || 'fields.status'),
      })),
    ],
    [t],
  )

  const scriptTypeOptions = useMemo(
    () =>
      (scriptTypes || []).map((type) => ({
        value: type.value,
        label: type.name,
      })),
    [scriptTypes],
  )

  const filters: FilterDef[] = useMemo(
    () => [
      {
        key: 'scriptType',
        label: `${t('fields.script_type')}:`,
        value: scriptType,
        options: scriptTypeOptions,
        onChange: handleTypeChange,
        width: 220,
      },
      {
        key: 'sortBy',
        label: `${t('fields.sort_by')}:`,
        value: sortBy,
        options: sortOptions,
        onChange: handleSortByFilter,
        width: 180,
      },
    ],
    [t, scriptType, scriptTypeOptions, sortBy, sortOptions, handleTypeChange, handleSortByFilter],
  )

  const searchLabel = useMemo(() => `${t('fields.scripts')}:`, [t])
  const searchPlaceholder = useMemo(() => t('placeholders.search_scripts'), [t])

  const primaryAction = useMemo(
    () => ({
      label: t('messages.add_script'),
      icon: <Add className={classes.addIcon} />,
      onClick: handleAdd,
      disabled: !canWrite,
    }),
    [t, handleAdd, canWrite, classes],
  )

  const columns: ColumnDef<ScriptTableRow>[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('fields.name'),
        sortable: true,
        render: (_value, row) => (
          <div>
            <GluuText variant="span" disableThemeColor className={classes.cellName}>
              {row.name}
            </GluuText>
            {row.scriptError?.stackTrace && (
              <GluuBadge
                size="sm"
                backgroundColor={badgeStyles.errorBadge.backgroundColor}
                textColor={badgeStyles.errorBadge.textColor}
                borderColor={badgeStyles.errorBadge.borderColor}
                className={classes.errorBadgeMargin}
              >
                {t('fields.error')}
              </GluuBadge>
            )}
          </div>
        ),
      },
      {
        key: 'description',
        label: t('fields.description'),
        sortable: true,
        width: '35%',
        render: (_value, row) => {
          const desc = row.description || '—'
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
        key: 'scriptType',
        label: t('fields.script_type'),
        sortable: true,
        render: (_value, row) => (
          <GluuBadge
            size="md"
            backgroundColor={badgeStyles.scriptTypeBadge.backgroundColor}
            textColor={badgeStyles.scriptTypeBadge.textColor}
            borderColor={badgeStyles.scriptTypeBadge.borderColor}
            className={classes.scriptTypeBadge}
          >
            {row.scriptType}
          </GluuBadge>
        ),
      },
      {
        key: 'enabled',
        label: t('options.enabled'),
        sortable: false,
        render: (_value, row) => {
          const isEnabled = row.enabled === true
          const style = isEnabled ? badgeStyles.enabledBadge : badgeStyles.disabledBadge
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={5}
              className={classes.enabledBadge}
            >
              {row.enabled ? t('options.yes') : t('options.no')}
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
      onClick: (row: ScriptTableRow) => void
    }> = []
    if (canWrite) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('messages.edit_script'),
        id: 'editScript',
        onClick: handleEdit,
      })
    }
    if (canRead) {
      list.push({
        icon: <VisibilityOutlined className={classes.viewIcon} />,
        tooltip: t('messages.view_script_details'),
        id: 'viewScript',
        onClick: handleView,
      })
    }
    if (canDelete) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('messages.delete_script'),
        id: 'deleteScript',
        onClick: handleDeleteClick,
      })
    }
    return list
  }, [canWrite, canRead, canDelete, t, handleEdit, handleView, handleDeleteClick, classes])

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
    (row: ScriptTableRow, index: number) => row.inum ?? `no-inum-${index}`,
    [],
  )

  const emptyMessage = useMemo(() => {
    if (!pattern && scripts.length === 0) {
      return t('messages.no_scripts_found')
    }
    return t('messages.no_data')
  }, [pattern, scripts.length, t])

  const detailLabelStyle = useMemo(
    () => ({ color: themeColors.fontColor }),
    [themeColors.fontColor],
  )

  const getScriptDetailFields = useCallback(
    (row: ScriptTableRow) => [
      { label: 'fields.inum', value: row.inum, doc_entry: 'inum', doc_category: SCRIPT },
      {
        label: 'fields.location_type',
        value: row.locationType,
        doc_entry: 'locationType',
        doc_category: SCRIPT,
      },
      {
        label: 'fields.internal',
        value: row.internal ? t('options.true') : t('options.false'),
        doc_entry: 'internal',
        doc_category: SCRIPT,
        isBadge: true,
        badgeBackgroundColor: row.internal
          ? themeColors.badges.filledBadgeBg
          : themeColors.badges.disabledBg,
        badgeTextColor: row.internal
          ? themeColors.badges.filledBadgeText
          : themeColors.badges.disabledText,
      },
      {
        label: 'fields.programming_language',
        value: row.programmingLanguage,
        doc_entry: 'programmingLanguage',
        doc_category: SCRIPT,
      },
      { label: 'fields.level', value: row.level, doc_entry: 'level', doc_category: SCRIPT },
      { label: 'fields.name', value: row.name, doc_entry: 'name', doc_category: SCRIPT },
      {
        label: 'fields.description',
        value: row.description,
        doc_entry: 'description',
        doc_category: SCRIPT,
      },
      {
        label: 'options.enabled',
        value: row.enabled ? t('options.true') : t('options.false'),
        doc_entry: 'enabled',
        doc_category: SCRIPT,
        isBadge: true,
        badgeBackgroundColor: row.enabled
          ? themeColors.badges.filledBadgeBg
          : themeColors.badges.disabledBg,
        badgeTextColor: row.enabled
          ? themeColors.badges.filledBadgeText
          : themeColors.badges.disabledText,
      },
      {
        label: 'fields.script_type',
        value: row.scriptType,
        doc_entry: 'scriptType',
        doc_category: SCRIPT,
        isBadge: true,
        badgeBackgroundColor: themeColors.badges.statusActiveBg,
        badgeTextColor: themeColors.badges.statusActive,
      },
      {
        label: 'fields.revision',
        value: row.revision,
        doc_entry: 'revision',
        doc_category: SCRIPT,
      },
    ],
    [t, themeColors],
  )

  const loading = isLoading || deleteMutation.isPending

  if (error) {
    return (
      <GluuLoader blocking={false}>
        <div className={classes.page}>
          <GluuViewWrapper canShow={canRead}>
            <div className={classes.searchCard}>
              <div className={classes.searchCardContent}>
                <div className={classes.errorMessage}>{t('messages.error_loading_scripts')}</div>
                <GluuText variant="p" disableThemeColor>
                  {error && typeof error === 'object' && 'message' in error
                    ? (error as { message: string }).message
                    : String(error)}
                </GluuText>
              </div>
            </div>
          </GluuViewWrapper>
        </div>
      </GluuLoader>
    )
  }

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
                onSearch={setPattern}
                onSearchSubmit={handleSearchSubmit}
                filters={filters}
                onRefresh={canRead ? handleRefresh : undefined}
                refreshLoading={isLoading || loadingTypes}
                primaryAction={primaryAction}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<ScriptTableRow>
              columns={columns}
              data={scripts}
              loading={false}
              expandable
              renderExpandedRow={(row) => (
                <GluuDetailGrid
                  fields={getScriptDetailFields(row)}
                  labelStyle={detailLabelStyle}
                  defaultDocCategory={SCRIPT}
                  layout="column"
                />
              )}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              sortColumn={sortBy || null}
              sortDirection={sortBy ? (sortOrder === 'descending' ? 'desc' : 'asc') : null}
              onSort={handleSort}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>

        {canDelete && itemToDelete && (
          <GluuDialog
            row={itemToDelete}
            name={itemToDelete.name}
            handler={() => {
              setModal(false)
              setItemToDelete(null)
            }}
            modal={modal}
            subject="script"
            onAccept={(message: string) => handleDeleteConfirm(message, itemToDelete?.inum)}
            feature={adminUiFeatures.custom_script_delete}
          />
        )}
      </div>
    </GluuLoader>
  )
}

export default memo(CustomScriptListPage)
