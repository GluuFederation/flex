import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload } from 'Utils/auditAction'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { Add, Edit, VisibilityOutlined, DeleteOutlined } from '@/components/icons'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { ColumnDef, ActionDef, PaginationConfig } from '@/components/GluuTable'
import { adminUiFeatures } from '@/constants'
import getThemeColor from 'Context/theme/config'
import { ThemeContext } from 'Context/theme/themeContext'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { useIdentityProviders, useDeleteIdentityProvider, type IdentityProvider } from './hooks'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { logger } from '@/utils/logger'
import { useStyles } from './styles/WebsiteSsoList.style'

interface DeleteItem {
  inum?: string
  displayName?: string
}

const LIMIT_OPTIONS = getRowsPerPageOptions()
const samlResourceId = ADMIN_UI_RESOURCES.SAML

const WebsiteSsoIdentityBrokeringList = React.memo(() => {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const [modal, setModal] = useState(false)
  const [pattern, setPattern] = useState('')
  const [item, setItem] = useState<DeleteItem>({})
  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()

  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()

  const queryParams = useMemo(
    () => ({
      startIndex: pageNumber * limit,
      limit,
      ...(pattern ? { pattern } : {}),
    }),
    [pageNumber, limit, pattern],
  )

  const {
    data: idpData,
    isLoading: isInitialLoading,
    isFetching: isFetchingData,
  } = useIdentityProviders(queryParams)
  const deleteIdentityProviderMutation = useDeleteIdentityProvider()

  const isLoading = isInitialLoading || isFetchingData || deleteIdentityProviderMutation.isPending

  const items = idpData?.entries ?? []
  const totalItems = idpData?.totalEntriesCount ?? 0

  const {
    canRead: canReadIdentities,
    canWrite: canWriteIdentities,
    canDelete: canDeleteIdentities,
  } = usePermission(samlResourceId)

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  const handleGoToEditPage = useCallback(
    (rowData: IdentityProvider, viewOnly?: boolean): void => {
      navigateToRoute(ROUTES.SAML_IDP_EDIT, { state: { rowData: rowData, viewOnly: viewOnly } })
    },
    [navigateToRoute],
  )

  const handleGoToAddPage = useCallback((): void => {
    navigateToRoute(ROUTES.SAML_IDP_ADD)
  }, [navigateToRoute])

  const handleDelete = useCallback(
    (row: IdentityProvider): void => {
      setItem({ inum: row.inum, displayName: row.displayName })
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    async (message: string): Promise<void> => {
      if (!item.inum) {
        return
      }

      const userAction: { action_message: string; action_data: string } = {
        action_message: '',
        action_data: '',
      }
      buildPayload(userAction, message, item.inum)
      try {
        await deleteIdentityProviderMutation.mutateAsync({
          inum: userAction.action_data,
          userMessage: userAction.action_message,
        })
        toggle()
      } catch (error) {
        logger.error(
          'Failed to delete identity provider:',
          error instanceof Error ? error : String(error),
        )
      }
    },
    [deleteIdentityProviderMutation, item.inum, toggle],
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
  }, [setPageNumber])

  const handlePageChange = useCallback((page: number) => setPageNumber(page), [setPageNumber])

  const handleRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      setLimit(rowsPerPage)
      setPageNumber(0)
    },
    [setLimit, setPageNumber],
  )

  const columns: ColumnDef<IdentityProvider>[] = useMemo(
    () => [
      { key: 'inum', label: t('fields.inum'), sortable: true },
      { key: 'displayName', label: t('fields.displayName'), sortable: true },
      { key: 'enabled', label: t('fields.enabled'), sortable: true },
    ],
    [t],
  )

  const actions: ActionDef<IdentityProvider>[] = useMemo(() => {
    const list: ActionDef<IdentityProvider>[] = []
    if (canWriteIdentities) {
      list.push({
        icon: <Edit className={classes.editIcon} />,
        tooltip: t('titles.edit_identity_provider'),
        onClick: (row) => handleGoToEditPage(row),
      })
    }
    if (canReadIdentities) {
      list.push({
        icon: <VisibilityOutlined className={classes.viewIcon} />,
        tooltip: t('titles.view_identity_provider'),
        onClick: (row) => handleGoToEditPage(row, true),
      })
    }
    if (canDeleteIdentities) {
      list.push({
        icon: <DeleteOutlined className={classes.deleteIcon} />,
        tooltip: t('titles.delete_identity_provider'),
        onClick: handleDelete,
      })
    }
    return list
  }, [
    canWriteIdentities,
    canReadIdentities,
    canDeleteIdentities,
    t,
    classes,
    handleGoToEditPage,
    handleDelete,
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
    [pageNumber, limit, totalItems, handlePageChange, handleRowsPerPageChange],
  )

  const primaryAction = useMemo(
    () => ({
      label: t('titles.create_identity_provider'),
      icon: <Add className={classes.addIcon} />,
      onClick: handleGoToAddPage,
      disabled: !canWriteIdentities,
    }),
    [t, classes.addIcon, handleGoToAddPage, canWriteIdentities],
  )

  const getRowKey = useCallback(
    (row: IdentityProvider, index: number) => row.inum ?? `row-${index}`,
    [],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadIdentities}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t('fields.pattern')}:`}
                searchPlaceholder={t('placeholders.search_pattern')}
                searchValue={pattern}
                searchOnType
                onSearch={handleSearch}
                onSearchSubmit={handleSearch}
                onRefresh={canReadIdentities ? handleRefresh : undefined}
                refreshLoading={isLoading}
                primaryAction={primaryAction}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<IdentityProvider>
              columns={columns}
              data={items}
              loading={false}
              pagination={pagination}
              onPagingSizeSync={onPagingSizeSync}
              actions={actions}
              getRowKey={getRowKey}
              emptyMessage={t('messages.no_data')}
            />
          </div>
        </GluuViewWrapper>
        {canDeleteIdentities && (
          <GluuDialog
            row={item}
            name={item?.displayName || ''}
            handler={toggle}
            modal={modal}
            subject="saml idp"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.saml_delete}
          />
        )}
      </div>
    </GluuLoader>
  )
})

WebsiteSsoIdentityBrokeringList.displayName = 'WebsiteSsoIdentityBrokeringList'

export default WebsiteSsoIdentityBrokeringList
