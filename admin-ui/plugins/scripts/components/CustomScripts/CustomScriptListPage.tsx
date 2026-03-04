import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from 'react'
import { DeleteOutlined, Edit, Add, VisibilityOutlined } from '@mui/icons-material'
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
import { useCedarling, CEDAR_RESOURCE_SCOPES, ADMIN_UI_RESOURCES } from '@/cedarling'
import { devLogger } from '@/utils/devLogger'
import { updateToast } from 'Redux/features/toastSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import { useCustomScriptsByType, useDeleteCustomScript, useCustomScriptTypes } from './hooks'
import { useStyles } from './styles/CustomScriptListPage.style'
import { SCRIPT } from 'Utils/ApiResources'
import type { CustomScript } from 'JansConfigApi'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'
import type { ScriptError } from './types/customScript'
import { BORDER_RADIUS } from '@/constants'
import {
  DEFAULT_SCRIPT_TYPE,
  SORT_COLUMNS,
  SORT_COLUMN_LABELS,
  DEFAULT_SORT_BY,
  FEATURE_CUSTOM_SCRIPT_DELETE,
} from './constants'

const LIMIT_OPTIONS = getRowsPerPageOptions()

const DELETE_SUBJECT_SCRIPT = 'script'
const EMPTY_DESCRIPTION_PLACEHOLDER = '—'

type DisplayValue = GluuDetailGridField['value']

const displayOrDash = (value: DisplayValue): DisplayValue =>
  value === null || value === undefined || value === '' ? '−' : value

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
  const [scriptType, setScriptType] = useState<string>(DEFAULT_SCRIPT_TYPE)
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_BY)

  const [modal, setModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CustomScript | null>(null)

  const scriptsResourceId = ADMIN_UI_RESOURCES.Scripts
  const scriptScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[scriptsResourceId] ?? [],
    [scriptsResourceId],
  )

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
    refetch,
  } = useCustomScriptsByType(scriptType, {
    pattern: pattern || undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortBy ? 'ascending' : undefined,
    limit,
    startIndex: pageNumber * limit + 1,
  })

  const { data: scriptTypes, isLoading: loadingTypes } = useCustomScriptTypes()
  const deleteMutation = useDeleteCustomScript()

  const { scripts, totalItems } = useMemo(
    () => ({
      scripts: (scriptsResponse?.entries || []) as ScriptTableRow[],
      totalItems: scriptsResponse?.totalEntriesCount ?? 0,
    }),
    [scriptsResponse],
  )

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

  const handleResetAndRefetch = useCallback(() => {
    setPageNumber(0)
    refetch()
  }, [refetch, setPageNumber])

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

  const scriptTypeOptions = useMemo(() => {
    if (scriptTypes && scriptTypes.length > 0) {
      return scriptTypes.map((type) => ({
        value: type.value,
        label: type.name,
      }))
    }
    return [{ value: DEFAULT_SCRIPT_TYPE, label: 'Person Authentication' }]
  }, [scriptTypes])

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
    (): ColumnDef<ScriptTableRow>[] => [
      {
        key: 'inum',
        label: t('fields.inum'),
        sortable: true,
      },
      {
        key: 'name',
        label: t('fields.name'),
        sortable: true,
        render: (_value, row) => (
          <div className={classes.cellNameWrap}>
            <GluuText variant="span" disableThemeColor className={classes.cellName}>
              {row.name}
            </GluuText>
            {row.scriptError?.stackTrace && (
              <GluuBadge
                size="sm"
                backgroundColor={badgeStyles.errorBadge.backgroundColor}
                textColor={badgeStyles.errorBadge.textColor}
                borderColor={badgeStyles.errorBadge.borderColor}
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
          const desc = row.description ?? EMPTY_DESCRIPTION_PLACEHOLDER
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
        sortable: true,
        render: (_value, row) => {
          const isEnabled = row.enabled === true
          const style = isEnabled ? badgeStyles.enabledBadge : badgeStyles.disabledBadge
          return (
            <GluuBadge
              size="md"
              backgroundColor={style.backgroundColor}
              textColor={style.textColor}
              borderColor={style.borderColor}
              borderRadius={BORDER_RADIUS.SMALL}
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

  const handleCloseDeleteModal = useCallback(() => {
    setModal(false)
    setItemToDelete(null)
  }, [])

  const handleDeleteAccept = useCallback(
    (message: string) => {
      handleDeleteConfirm(message, itemToDelete?.inum)
    },
    [handleDeleteConfirm, itemToDelete?.inum],
  )

  const deleteDialogLabel = useMemo(
    () =>
      itemToDelete
        ? `${t('messages.action_deletion_for')} ${DELETE_SUBJECT_SCRIPT} (${itemToDelete.name ?? ''}${itemToDelete.inum ? `-${itemToDelete.inum}` : ''})`
        : '',
    [t, itemToDelete],
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
      {
        label: 'fields.inum',
        value: displayOrDash(row.inum),
        doc_entry: 'inum',
        doc_category: SCRIPT,
      },
      {
        label: 'fields.location_type',
        value: displayOrDash(row.locationType),
        doc_entry: 'locationType',
        doc_category: SCRIPT,
      },
      {
        label: 'fields.internal',
        value: row.internal ? t('options.yes') : t('options.no'),
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
        value: displayOrDash(row.programmingLanguage),
        doc_entry: 'programmingLanguage',
        doc_category: SCRIPT,
      },
      {
        label: 'fields.level',
        value: displayOrDash(row.level),
        doc_entry: 'level',
        doc_category: SCRIPT,
      },
      {
        label: 'fields.name',
        value: displayOrDash(row.name),
        doc_entry: 'name',
        doc_category: SCRIPT,
      },
      {
        label: 'fields.description',
        value: displayOrDash(row.description),
        doc_entry: 'description',
        doc_category: SCRIPT,
      },
      {
        label: 'options.enabled',
        value: row.enabled ? t('options.yes') : t('options.no'),
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
        value: displayOrDash(row.scriptType),
        doc_entry: 'scriptType',
        doc_category: SCRIPT,
        isBadge: true,
        badgeBackgroundColor: themeColors.badges.statusActiveBg,
        badgeTextColor: themeColors.badges.statusActive,
      },
      {
        label: 'fields.revision',
        value: displayOrDash(row.revision),
        doc_entry: 'revision',
        doc_category: SCRIPT,
      },
    ],
    [t, themeColors],
  )

  const renderExpandedRow = useCallback(
    (row: ScriptTableRow) => (
      <GluuDetailGrid
        fields={getScriptDetailFields(row)}
        labelStyle={detailLabelStyle}
        defaultDocCategory={SCRIPT}
        layout="column"
      />
    ),
    [getScriptDetailFields, detailLabelStyle],
  )

  const loading = useMemo(
    () => isLoading || deleteMutation.isPending,
    [isLoading, deleteMutation.isPending],
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
                onSearch={setPattern}
                onSearchSubmit={handleResetAndRefetch}
                filters={filters}
                onRefresh={canRead ? handleResetAndRefetch : undefined}
                refreshLoading={isLoading || loadingTypes}
                primaryAction={primaryAction}
                disabled={loading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<ScriptTableRow>
              columns={columns}
              data={scripts}
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
            onAccept={handleDeleteAccept}
            label={deleteDialogLabel}
            feature={FEATURE_CUSTOM_SCRIPT_DELETE}
            autoCloseOnAccept
          />
        )}
      </div>
    </GluuLoader>
  )
}

export default memo(CustomScriptListPage)
