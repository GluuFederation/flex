import React, { useCallback, useEffect, useContext, useMemo, useState, useRef } from 'react'
import { debounce } from 'lodash'
import MaterialTable, { type Action } from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { DeleteOutlined } from '@mui/icons-material'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { TablePagination } from '@mui/material'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import getThemeColor from 'Context/theme/config'
import { ThemeContext } from 'Context/theme/themeContext'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { PaperContainer, getIdentityProviderTableCols } from '../helper/tableUtils'
import { useIdentityProviders, useDeleteIdentityProvider, type IdentityProvider } from './hooks'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface DeleteItem {
  inum?: string
  displayName?: string
  tableData?: Record<string, never>
}

const DeleteOutlinedIcon = () => <DeleteOutlined />

const WebsiteSsoIdentityBrokeringList = React.memo(() => {
  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)

  const [modal, setModal] = useState(false)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState<string>('')
  const [item, setItem] = useState<DeleteItem>({})
  const [pageNumber, setPageNumber] = useState(0)
  const prevPatternRef = useRef<string | null>(null)

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

  const samlResourceId = useMemo(() => ADMIN_UI_RESOURCES.SAML, [])
  const samlScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[samlResourceId], [samlResourceId])
  const canReadIdentities = useMemo(
    () => hasCedarReadPermission(samlResourceId),
    [hasCedarReadPermission, samlResourceId],
  )
  const canWriteIdentities = useMemo(
    () => hasCedarWritePermission(samlResourceId),
    [hasCedarWritePermission, samlResourceId],
  )
  const canDeleteIdentities = useMemo(
    () => hasCedarDeletePermission(samlResourceId),
    [hasCedarDeletePermission, samlResourceId],
  )

  useEffect(() => {
    authorizeHelper(samlScopes)
  }, [authorizeHelper, samlScopes])

  const debouncedSetPattern = useMemo(
    () =>
      debounce((value: string) => {
        setPattern(value || null)
      }, 500),
    [],
  )

  useEffect(() => {
    return () => {
      debouncedSetPattern.cancel()
    }
  }, [debouncedSetPattern])

  useEffect(() => {
    if (pattern !== prevPatternRef.current) {
      prevPatternRef.current = pattern
      setPageNumber(0)
    }
  }, [pattern])

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
      toggle()

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
      } catch (error) {
        console.error('Failed to delete identity provider:', error)
      }
    },
    [deleteIdentityProviderMutation, item.inum, toggle],
  )

  const onRowCountChangeClick = useCallback((count: number): void => {
    setPageNumber(0)
    setLimit(count)
  }, [])

  const onPageChangeClick = useCallback((page: number): void => {
    setPageNumber(page)
  }, [])

  const handleRefresh = useCallback((): void => {
    setPageNumber(0)
  }, [])

  const handleOptionsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.name === 'limit') {
        setLimit(Number(event.target.value))
      } else if (event.target.name === 'pattern') {
        const value = event.target.value
        setSearchInput(value)
        debouncedSetPattern(value)
      }
    },
    [debouncedSetPattern],
  )

  const handleOptionsKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.target instanceof HTMLInputElement && event.target.name === 'pattern') {
        if (event.key === 'Enter' || event.keyCode === 13) {
          const nextPattern = event.target.value
          setSearchInput(nextPattern)
          debouncedSetPattern.cancel()
          setPattern(nextPattern || null)
          setPageNumber(0)
        }
      }
    },
    [debouncedSetPattern],
  )

  const PaginationWrapper = useCallback(
    (): React.ReactElement => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(_prop: React.MouseEvent<HTMLButtonElement> | null, page: number): void => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ): void => {
          onRowCountChangeClick(Number(event.target.value))
        }}
      />
    ),
    [pageNumber, totalItems, onPageChangeClick, limit, onRowCountChangeClick],
  )

  const GluuSearch = useCallback((): React.ReactElement => {
    return (
      <GluuAdvancedSearch
        limitId={'searchLimit'}
        patternId={'searchPattern'}
        limit={limit}
        pattern={searchInput}
        onChange={handleOptionsChange}
        onKeyDown={handleOptionsKeyDown}
        showLimit={false}
        controlled={true}
      />
    )
  }, [limit, searchInput, handleOptionsChange, handleOptionsKeyDown])

  const tableActions = useMemo(() => {
    const actions: Action<IdentityProvider>[] = []
    if (canWriteIdentities) {
      actions.push({
        icon: 'edit',
        tooltip: `${t('titles.edit_identity_provider')}`,
        iconProps: { style: { color: customColors.darkGray } },
        onClick: (
          _event: React.MouseEvent,
          rowData: IdentityProvider | IdentityProvider[],
        ): void => {
          if (Array.isArray(rowData)) return
          const { tableData, ...clean } = rowData as IdentityProvider & { tableData?: unknown }
          void tableData
          handleGoToEditPage(clean)
        },
      })
      actions.push({
        icon: 'add',
        tooltip: `${t('titles.create_identity_provider')}`,
        iconProps: { color: 'primary' },
        isFreeAction: true,
        onClick: () => handleGoToAddPage(),
      })
    }
    if (canReadIdentities) {
      actions.push({
        icon: 'visibility',
        tooltip: `${t('titles.view_identity_provider')}`,
        onClick: (
          _event: React.MouseEvent,
          rowData: IdentityProvider | IdentityProvider[],
        ): void => {
          if (Array.isArray(rowData)) return
          handleGoToEditPage(rowData, true)
        },
      })
    }
    if (canDeleteIdentities) {
      actions.push({
        icon: DeleteOutlinedIcon,
        iconProps: { color: 'secondary' },
        tooltip: `${t('titles.delete_identity_provider')}`,
        onClick: (
          _event: React.MouseEvent,
          rowData: IdentityProvider | IdentityProvider[],
        ): void => {
          if (Array.isArray(rowData)) return
          handleDelete(rowData)
        },
      })
    }
    const handleSearchIconClickNoop = (): void => {}
    actions.push({
      icon: GluuSearch,
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: handleSearchIconClickNoop,
    })
    actions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: handleRefresh,
    } as Action<IdentityProvider> & { 'data-testid'?: string })
    return actions
  }, [
    canWriteIdentities,
    canReadIdentities,
    canDeleteIdentities,
    t,
    handleGoToEditPage,
    handleGoToAddPage,
    handleDelete,
    handleRefresh,
    GluuSearch,
  ])

  const tableColumns = useMemo(() => getIdentityProviderTableCols(t), [t])

  const headerStyle = useMemo(
    () =>
      ({
        ...applicationStyle.tableHeaderStyle,
        backgroundColor: themeColors.background,
        color: themeColors.fontColor,
      }) as React.CSSProperties,
    [themeColors.background, themeColors.fontColor],
  )

  const tableOptions = useMemo(
    () => ({
      search: false,
      selection: false,
      idSynonym: 'inum',
      pageSize: limit,
      headerStyle,
      actionsColumnIndex: -1,
    }),
    [limit, headerStyle],
  )

  const tableComponents = useMemo(
    () => ({
      Container: PaperContainer,
      Pagination: PaginationWrapper,
    }),
    [PaginationWrapper],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <GluuViewWrapper canShow={canReadIdentities}>
        <MaterialTable
          components={tableComponents}
          columns={tableColumns}
          data={items}
          isLoading={isLoading}
          title=""
          actions={tableActions}
          options={tableOptions}
        />
      </GluuViewWrapper>
      {canDeleteIdentities && (
        <GluuDialog
          row={item}
          name={item?.displayName || ''}
          handler={toggle}
          modal={modal}
          subject="saml idp"
          onAccept={onDeletionConfirmed}
          feature={adminUiFeatures.saml_idp_write}
        />
      )}
    </GluuLoader>
  )
})

WebsiteSsoIdentityBrokeringList.displayName = 'WebsiteSsoIdentityBrokeringList'

export default WebsiteSsoIdentityBrokeringList
