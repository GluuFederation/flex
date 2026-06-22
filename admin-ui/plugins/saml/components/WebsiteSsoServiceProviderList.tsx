import React, { useCallback, use, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload } from 'Utils/auditAction'
import type { UserAction } from 'Utils/types'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { Add, Edit, VisibilityOutlined, DeleteOutlined } from '@/components/icons'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { ColumnDef, ActionDef, PaginationConfig } from '@/components/GluuTable'
import { adminUiFeatures } from '@/constants'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import {
  useTrustRelationships,
  useDeleteTrustRelationshipMutation,
  type TrustRelationship,
} from './hooks'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { logger } from '@/utils/logger'
import { useStyles } from './styles/WebsiteSsoList.style'

interface DeleteItem {
  inum: string
  displayName?: string
}

const LIMIT_OPTIONS = getRowsPerPageOptions()
const samlResourceId = ADMIN_UI_RESOURCES.SAML

const matchesPattern = (provider: TrustRelationship, pattern: string): boolean => {
  if (!pattern) return true
  const needle = pattern.toLowerCase()
  return [provider.inum, provider.displayName].some((field) =>
    (field ?? '').toLowerCase().includes(needle),
  )
}

const WebsiteSsoServiceProviderList = React.memo(() => {
  const theme = use(ThemeContext)
  const selectedTheme = useMemo(() => theme?.state?.theme ?? DEFAULT_THEME, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const [modal, setModal] = useState(false)
  const [item, setItem] = useState<DeleteItem>({ inum: '' })
  const [pattern, setPattern] = useState('')
  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()

  const {
    data: websiteSsoServiceProviders = [],
    isLoading: isInitialLoading,
    isFetching: isFetchingData,
    refetch,
  } = useTrustRelationships()
  const deleteTrustRelationshipMutation = useDeleteTrustRelationshipMutation()

  const isLoading = isInitialLoading || isFetchingData || deleteTrustRelationshipMutation.isPending

  const {
    canRead: canReadWebsiteSsoServiceProviders,
    canWrite: canWriteWebsiteSsoServiceProviders,
    canDelete: canDeleteWebsiteSsoServiceProviders,
  } = usePermission(samlResourceId)

  const handleGoToEditPage = useCallback(
    (rowData: TrustRelationship, viewOnly?: boolean) => {
      navigateToRoute(ROUTES.SAML_SP_EDIT, { state: { rowData: rowData, viewOnly: viewOnly } })
    },
    [navigateToRoute],
  )

  const handleGoToAddPage = useCallback(() => {
    navigateToRoute(ROUTES.SAML_SP_ADD)
  }, [navigateToRoute])

  const handleDelete = useCallback(
    (row: TrustRelationship) => {
      setItem({ inum: row.inum || '', displayName: row.displayName })
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    async (message: string) => {
      toggle()

      const userAction: UserAction = {
        action_message: '',
        action_data: '',
      }
      buildPayload(userAction, message, item.inum)
      try {
        await deleteTrustRelationshipMutation.mutateAsync({
          id: userAction.action_data as string,
          userMessage: userAction.action_message,
        })
      } catch (error) {
        logger.error(
          'Failed to delete service provider:',
          error instanceof Error ? error : String(error),
        )
      }
    },
    [deleteTrustRelationshipMutation, item.inum, toggle],
  )

  const handleSearch = useCallback(
    (value: string) => {
      setPattern(value)
      setPageNumber(0)
    },
    [setPageNumber],
  )

  const handleRefresh = useCallback(() => {
    setPattern('')
    setPageNumber(0)
    refetch()
  }, [setPageNumber, refetch])

  const handlePageChange = useCallback((page: number) => setPageNumber(page), [setPageNumber])

  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  const filteredProviders = useMemo(
    () => websiteSsoServiceProviders.filter((provider) => matchesPattern(provider, pattern)),
    [websiteSsoServiceProviders, pattern],
  )

  const pagedProviders = useMemo(
    () => filteredProviders.slice(pageNumber * limit, pageNumber * limit + limit),
    [filteredProviders, pageNumber, limit],
  )

  const columns: ColumnDef<TrustRelationship>[] = useMemo(
    () => [
      { key: 'inum', label: t('fields.inum'), sortable: true },
      { key: 'displayName', label: t('fields.displayName'), sortable: true },
      { key: 'enabled', label: t('fields.enabled'), sortable: true },
    ],
    [t],
  )

  const actions: ActionDef<TrustRelationship>[] = useMemo(() => {
    const list: ActionDef<TrustRelationship>[] = []
    if (canWriteWebsiteSsoServiceProviders) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('messages.edit_service_provider'),
        onClick: (row) => handleGoToEditPage(row),
      })
    }
    if (canReadWebsiteSsoServiceProviders) {
      list.push({
        icon: <VisibilityOutlined className={classes.viewIcon} />,
        tooltip: t('messages.view_service_provider'),
        onClick: (row) => handleGoToEditPage(row, true),
      })
    }
    if (canDeleteWebsiteSsoServiceProviders) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('messages.delete_service_provider'),
        onClick: handleDelete,
      })
    }
    return list
  }, [
    canWriteWebsiteSsoServiceProviders,
    canReadWebsiteSsoServiceProviders,
    canDeleteWebsiteSsoServiceProviders,
    t,
    classes,
    handleGoToEditPage,
    handleDelete,
  ])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: pageNumber,
      rowsPerPage: limit,
      totalItems: filteredProviders.length,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [pageNumber, limit, filteredProviders.length, handlePageChange, handleRowsPerPageChange],
  )

  const primaryAction = useMemo(
    () => ({
      label: t('messages.add_service_provider'),
      icon: <Add className={classes.addIcon} />,
      onClick: handleGoToAddPage,
      disabled: !canWriteWebsiteSsoServiceProviders,
    }),
    [t, classes.addIcon, handleGoToAddPage, canWriteWebsiteSsoServiceProviders],
  )

  const getRowKey = useCallback(
    (row: TrustRelationship, index: number) => row.inum ?? `row-${index}`,
    [],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadWebsiteSsoServiceProviders}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t('fields.pattern')}:`}
                searchPlaceholder={t('placeholders.search_pattern')}
                searchValue={pattern}
                searchOnType
                onSearch={handleSearch}
                onSearchSubmit={handleSearch}
                onRefresh={canReadWebsiteSsoServiceProviders ? handleRefresh : undefined}
                refreshLoading={isLoading}
                primaryAction={primaryAction}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<TrustRelationship>
              columns={columns}
              data={pagedProviders}
              loading={false}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={t('messages.no_data')}
            />
          </div>
        </GluuViewWrapper>
        {canDeleteWebsiteSsoServiceProviders && (
          <GluuDialog
            row={item}
            name={item?.displayName || ''}
            handler={toggle}
            modal={modal}
            subject="saml website sso service provider"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.saml_delete}
          />
        )}
      </div>
    </GluuLoader>
  )
})

WebsiteSsoServiceProviderList.displayName = 'WebsiteSsoServiceProviderList'

export { matchesPattern }
export default WebsiteSsoServiceProviderList
