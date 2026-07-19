import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { Add, DeleteOutlined, Edit, FilterListIcon } from '@/components/icons'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuBadge } from '@/components/GluuBadge'
import { usePermission } from '@/cedarling/hooks/usePermission'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { logger } from '@/utils/logger'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useGetAllWebhooks } from 'JansConfigApi'
import { useDeleteWebhookWithAudit } from './hooks'
import { GluuTable, COLUMN_WIDTHS } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import { GluuButton } from '@/components/GluuButton'
import MobileNavSheet from '@/components/MobileBottomNav/MobileNavSheet'
import { SHEET_KEYS } from '@/components/MobileBottomNav/sheetConstants'
import useMediaQuery from '@mui/material/useMediaQuery'
import { FILTER_SHEET, MOBILE_MEDIA_QUERY } from '@/constants'
import customColors from '@/customColors'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import type { FilterDef } from '@/components/GluuSearchToolbar/types'
import type { WebhookEntry } from './types'
import { toWebhookEntries } from 'Plugins/admin/helper/webhook'
import { useStyles } from './styles/WebhookListPage.style'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { useDebounce } from '@/utils/hooks'

const LIMIT_OPTIONS = getRowsPerPageOptions()

const SEARCH_DEBOUNCE_MS = 500

const SORT_COLUMNS = ['inum', 'displayName', 'url', 'httpMethod', 'jansEnabled'] as const
const SORT_COLUMN_LABELS: Record<string, string> = {
  inum: 'fields.inum',
  displayName: 'fields.name',
  url: 'fields.url',
  httpMethod: 'fields.http_method',
  jansEnabled: 'fields.status',
}
const DEFAULT_SERVER_SORT: { column: string; desc: boolean } = { column: 'inum', desc: false }
const WEBHOOK_RESOURCE_ID = ADMIN_UI_RESOURCES.Webhooks
const WebhookListPage: React.FC = () => {
  const { navigateToRoute } = useAppNavigation()
  const {
    canRead: canReadWebhooks,
    canWrite: canWriteWebhooks,
    canDelete: canDeleteWebhooks,
  } = usePermission(WEBHOOK_RESOURCE_ID)

  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDarkTheme = themeState.theme === THEME_DARK
  const { classes, badgeStyles } = useStyles({ isDark: isDarkTheme, themeColors })

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState('')
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState<WebhookEntry | null>(null)
  const [serverSort, setServerSort] = useState(DEFAULT_SERVER_SORT)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [draftSort, setDraftSort] = useState(DEFAULT_SERVER_SORT.column)
  const [mobileSearch, setMobileSearch] = useState('')
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
  const debouncedMobileSearch = useDebounce(mobileSearch, SEARCH_DEBOUNCE_MS)

  SetTitle(t('titles.webhooks'))

  const { data, isLoading, refetch } = useGetAllWebhooks(
    {
      limit,
      pattern: pattern || undefined,
      startIndex: pageNumber * limit,
      sortBy: serverSort.column,
      sortOrder: serverSort.desc ? 'descending' : 'ascending',
    },
    {
      query: {
        enabled: canReadWebhooks,
      },
    },
  )

  const webhooks = useMemo(() => toWebhookEntries(data?.entries), [data])
  const totalItems = useMemo(() => data?.totalEntriesCount || 0, [data])

  const effectivePage = useMemo(() => {
    const maxPage = totalItems > 0 ? Math.max(0, Math.ceil(totalItems / limit) - 1) : 0
    return Math.min(pageNumber, maxPage)
  }, [pageNumber, totalItems, limit])

  useEffect(() => {
    if (totalItems > 0 && pageNumber > effectivePage) {
      setPageNumber(effectivePage)
    }
  }, [totalItems, pageNumber, limit, effectivePage])

  const { deleteWebhook, isLoading: isDeleting } = useDeleteWebhookWithAudit()

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const submitForm = useCallback(
    async (userMessage: string) => {
      const inumToDelete = deleteData?.inum
      if (inumToDelete) {
        try {
          await deleteWebhook(inumToDelete, userMessage)
          refetch()
          setDeleteData(null)
        } catch (error) {
          logger.error('Delete webhook failed:', error instanceof Error ? error : String(error))
        }
      }
    },
    [deleteData, deleteWebhook, refetch],
  )

  const navigateToAddPage = useCallback(() => {
    navigateToRoute(ROUTES.WEBHOOK_ADD)
  }, [navigateToRoute])

  const navigateToEditPage = useCallback(
    (rowData: WebhookEntry) => {
      if (!rowData?.inum) return
      navigateToRoute(ROUTES.WEBHOOK_EDIT(rowData.inum))
    },
    [navigateToRoute],
  )

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
    refetch()
  }, [refetch])

  const handleRefresh = useCallback(() => {
    setPageNumber(0)
    setPattern('')
    setServerSort(DEFAULT_SERVER_SORT)
    refetch()
  }, [refetch])

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page)
  }, [])

  const handleRowsPerPageChange = useCallback((rowsPerPage: number) => {
    setLimit(rowsPerPage)
    setPageNumber(0)
  }, [])

  const handleSortByFilter = useCallback((value: string) => {
    setServerSort({ column: value || 'inum', desc: false })
    setPageNumber(0)
  }, [])

  const sortOptions = useMemo(
    () =>
      SORT_COLUMNS.map((value) => ({
        value,
        label: t(SORT_COLUMN_LABELS[value] || 'fields.status'),
      })),
    [t],
  )

  const filters: FilterDef[] = useMemo(
    () => [
      {
        key: 'sortBy',
        label: `${t('fields.sort_by')}:`,
        value: serverSort.column,
        options: sortOptions,
        onChange: handleSortByFilter,
        width: 180,
      },
    ],
    [t, serverSort.column, handleSortByFilter, sortOptions],
  )

  const handleFilterSheetOpen = useCallback(() => {
    setDraftSort(serverSort.column)
    setFilterSheetOpen(true)
  }, [serverSort.column])

  const handleFilterSheetClose = useCallback(() => setFilterSheetOpen(false), [])

  const handleFilterSheetApply = useCallback(() => {
    handleSortByFilter(draftSort)
    setFilterSheetOpen(false)
  }, [draftSort, handleSortByFilter])

  useEffect(() => {
    if (!isMobile) return
    setPattern(debouncedMobileSearch)
  }, [isMobile, debouncedMobileSearch])

  const handleMobileSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileSearch(e.target.value)
  }, [])

  const handleMobileSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      setPattern(mobileSearch)
      handleSearchSubmit()
    },
    [handleSearchSubmit, mobileSearch],
  )

  const searchLabel = useMemo(() => `${t('fields.pattern')}:`, [t])
  const searchPlaceholder = useMemo(() => t('placeholders.search_pattern'), [t])

  const primaryAction = useMemo(
    () => ({
      label: t('messages.add_webhook'),
      icon: <Add className={classes.addIcon} />,
      onClick: navigateToAddPage,
      disabled: !canWriteWebhooks,
    }),
    [t, navigateToAddPage, canWriteWebhooks, classes],
  )

  const httpMethodBadgeMap = useMemo(
    () =>
      ({
        GET: badgeStyles.httpMethodBadgeGetPost,
        POST: badgeStyles.httpMethodBadgeGetPost,
        PUT: badgeStyles.httpMethodBadgePutPatch,
        PATCH: badgeStyles.httpMethodBadgePutPatch,
        DELETE: badgeStyles.httpMethodBadgeDelete,
      }) as Record<string, { backgroundColor: string; textColor: string; borderColor: string }>,
    [badgeStyles],
  )

  const columns: ColumnDef<WebhookEntry>[] = useMemo(
    () => [
      {
        key: 'displayName',
        label: t('fields.name'),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellDisplayName}>
            {row.displayName}
          </GluuText>
        ),
      },
      {
        key: 'url',
        label: t('fields.url'),
        sortable: true,
        render: (_value, row) => (
          <GluuText variant="span" disableThemeColor className={classes.cellUrl}>
            {row.url}
          </GluuText>
        ),
      },
      {
        key: 'httpMethod',
        label: t('fields.http_method'),
        sortable: true,
        width: COLUMN_WIDTHS.PILL_SINGLE_SHORT,
        render: (_value, row) => {
          const upper = (row.httpMethod || '').toUpperCase()
          const methodStyle = httpMethodBadgeMap[upper] ?? badgeStyles.httpMethodBadgeDefault
          return (
            <GluuBadge
              size="md"
              backgroundColor={methodStyle.backgroundColor}
              textColor={methodStyle.textColor}
              borderColor={methodStyle.borderColor}
              className={classes.httpMethodBadge}
            >
              {row.httpMethod}
            </GluuBadge>
          )
        },
      },
      {
        key: 'jansEnabled',
        label: t('fields.status'),
        sortable: true,
        width: COLUMN_WIDTHS.PILL_SINGLE_SHORT,
        render: (_value, row) => {
          const isEnabled = row.jansEnabled === true
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
    [t, classes, badgeStyles, httpMethodBadgeMap],
  )

  const actions = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode
      tooltip: string
      id?: string
      onClick: (row: WebhookEntry) => void
    }> = []
    if (canWriteWebhooks) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('actions.edit'),
        id: 'editWebhook',
        onClick: navigateToEditPage,
      })
    }
    if (canDeleteWebhooks) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('actions.delete'),
        id: 'deleteWebhook',
        onClick: (row) => {
          setDeleteData(row)
          toggle()
        },
      })
    }
    return list
  }, [canWriteWebhooks, canDeleteWebhooks, t, navigateToEditPage, toggle, classes])

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
    (row: WebhookEntry, index: number) => row.inum ?? `no-inum-${index}`,
    [],
  )

  const emptyMessage = useMemo(() => {
    if (!pattern && totalItems === 0) {
      return t('messages.no_webhooks_found')
    }
    return t('messages.no_data')
  }, [pattern, totalItems, t])

  const loading = isLoading || isDeleting

  return (
    <GluuLoader blocking={loading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadWebhooks}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              {isMobile ? (
                <div className={classes.mobileSearchRow}>
                  <input
                    type="text"
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    value={mobileSearch}
                    onChange={handleMobileSearchChange}
                    onKeyDown={handleMobileSearchKeyDown}
                    disabled={loading}
                    className={classes.mobileSearchInput}
                  />
                  <button
                    type="button"
                    aria-label={t('titles.filters')}
                    aria-haspopup="dialog"
                    aria-expanded={filterSheetOpen}
                    className={classes.mobileFilterButton}
                    onClick={handleFilterSheetOpen}
                    disabled={loading}
                  >
                    <FilterListIcon />
                  </button>
                </div>
              ) : (
                <GluuSearchToolbar
                  searchLabel={searchLabel}
                  searchPlaceholder={searchPlaceholder}
                  searchValue={pattern}
                  searchOnType
                  onSearch={setPattern}
                  onSearchSubmit={handleSearchSubmit}
                  filters={filters}
                  onRefresh={canReadWebhooks ? handleRefresh : undefined}
                  refreshLoading={isLoading}
                  primaryAction={primaryAction}
                  disabled={loading}
                />
              )}
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<WebhookEntry>
              columns={columns}
              data={webhooks}
              loading={false}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={emptyMessage}
            />
          </div>
        </GluuViewWrapper>
        {isMobile && (
          <MobileNavSheet
            openKey={filterSheetOpen ? SHEET_KEYS.CUSTOM : null}
            onClose={handleFilterSheetClose}
            title={t('titles.filters')}
          >
            <div className={classes.filterSheetContent}>
              <span className={classes.filterSheetLabel}>{`${t('fields.sort_by')}:`}</span>
              <div
                className={classes.filterSheetPills}
                role="group"
                aria-label={t('fields.sort_by')}
              >
                {sortOptions.map((option) => {
                  const selected = draftSort === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      className={`${classes.filterSheetPill} ${
                        selected ? classes.filterSheetPillSelected : ''
                      }`.trim()}
                      onClick={() => setDraftSort(option.value)}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <div className={classes.filterSheetButtons}>
                <GluuButton
                  type="button"
                  size="md"
                  block
                  outlined
                  onClick={handleFilterSheetClose}
                  borderColor={
                    isDarkTheme ? customColors.darkBorder : customColors.filterPillBorder
                  }
                  borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                  minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                  fontWeight={700}
                >
                  {t('actions.cancel')}
                </GluuButton>
                <GluuButton
                  type="button"
                  size="md"
                  block
                  onClick={handleFilterSheetApply}
                  backgroundColor={customColors.mobileNavActive}
                  borderColor={customColors.mobileNavActive}
                  textColor={customColors.white}
                  borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                  minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                  fontWeight={700}
                >
                  {t('actions.apply')}
                </GluuButton>
              </div>
            </div>
          </MobileNavSheet>
        )}
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          label={
            modal && deleteData
              ? `${t('messages.action_deletion_for')} ${t('messages.webhook_entity')} (${[deleteData.url, deleteData.inum].filter(Boolean).join('-')})`
              : ''
          }
        />
      </div>
    </GluuLoader>
  )
}

export default memo(WebhookListPage)
