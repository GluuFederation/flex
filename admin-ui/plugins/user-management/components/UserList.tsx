import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { DeleteOutlined, Edit, Add } from '@mui/icons-material'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import UserDetailViewPage from './UserDetailViewPage'
import User2FADevicesModal from './User2FADevicesModal'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { useGetUser, getGetUserQueryKey } from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { isDevelopment } from '@/utils/env'
import { UserTableRowData, CustomUser } from '../types'
import { useDeleteUserWithAudit } from '../hooks/useUserMutations'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { GluuTable } from '@/components/GluuTable'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import type { ColumnDef, PaginationConfig } from '@/components/GluuTable'
import { getRowsPerPageOptions, usePaginationState } from '@/utils/pagingUtils'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { useStyles } from './UserListPage.style'

const UserList = (): JSX.Element => {
  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()
  const queryClient = useQueryClient()

  const { t } = useTranslation()
  const [modal, setModal] = useState<boolean>(false)
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState<boolean>(false)
  const [selectedUserFor2FA, setSelectedUserFor2FA] = useState<UserTableRowData | null>(null)
  const [deleteData, setDeleteData] = useState<UserTableRowData | null>(null)

  const { limit, setLimit, pageNumber, setPageNumber, onPagingSizeSync } = usePaginationState()
  const [pattern, setPattern] = useState<string>('')
  const LIMIT_OPTIONS = useMemo(() => getRowsPerPageOptions(), [])

  // React Query hooks for data fetching
  const usersResourceId = useMemo(() => ADMIN_UI_RESOURCES.Users, [])
  const usersScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[usersResourceId], [usersResourceId])
  const canReadUsers = useMemo(
    () => hasCedarReadPermission(usersResourceId),
    [hasCedarReadPermission, usersResourceId],
  )
  const canWriteUsers = useMemo(
    () => hasCedarWritePermission(usersResourceId),
    [hasCedarWritePermission, usersResourceId],
  )
  const canDeleteUsers = useMemo(
    () => hasCedarDeletePermission(usersResourceId),
    [hasCedarDeletePermission, usersResourceId],
  )

  useEffect(() => {
    if (usersScopes && usersScopes.length > 0) {
      authorizeHelper(usersScopes)
    }
  }, [authorizeHelper, usersScopes])

  const {
    data: usersData,
    isLoading: loadingUsers,
    refetch: refetchUsers,
  } = useGetUser(
    {
      limit,
      pattern: pattern || undefined,
      startIndex: pageNumber * limit,
    },
    {
      query: {
        enabled: canReadUsers,
      },
    },
  )

  const usersList = useMemo(
    () => (usersData?.entries as UserTableRowData[]) ?? [],
    [usersData?.entries],
  )
  const totalItems = usersData?.totalEntriesCount || 0

  const { deleteUser, isLoading: isDeleting } = useDeleteUserWithAudit()

  const loading = loadingUsers || isDeleting
  const toggle = useCallback((): void => setModal((prev) => !prev), [])

  const submitForm = useCallback(
    async (userMessage: string) => {
      const inumToDelete = deleteData?.inum
      const userDataToDelete = deleteData as CustomUser | undefined
      if (inumToDelete) {
        try {
          const userWithMessage = userDataToDelete
            ? { ...userDataToDelete, action_message: userMessage }
            : undefined
          await deleteUser(inumToDelete, userMessage, userWithMessage)
          refetchUsers()
          setDeleteData(null)
        } catch (error) {
          if (isDevelopment) console.error('Delete user failed:', error)
        }
      }
    },
    [deleteData, deleteUser, refetchUsers],
  )
  const { state: themeState } = useTheme()
  const selectedTheme = themeState.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK
  SetTitle(t('titles.user_management'))

  const { navigateToRoute } = useAppNavigation()

  const handleGoToUserAddPage = useCallback((): void => {
    navigateToRoute(ROUTES.USER_ADD)
  }, [navigateToRoute])

  const handleView2FADetails = useCallback((row: UserTableRowData): void => {
    setSelectedUserFor2FA(row)
    setIsViewDetailModalOpen(true)
  }, [])

  const handleClose2FAModal = useCallback(() => {
    setIsViewDetailModalOpen(false)
    setSelectedUserFor2FA(null)
  }, [])

  const handleGoToUserEditPage = useCallback(
    (row: UserTableRowData): void => {
      const userId = row.tableData?.uuid || row.inum
      if (!userId) return
      const { tableData, ...userData } = row
      void tableData
      navigateToRoute(ROUTES.USER_EDIT(userId), { state: { selectedUser: userData as CustomUser } })
    },
    [navigateToRoute],
  )

  const { classes } = useStyles({ isDark, themeColors })

  const effectivePage = useMemo(() => {
    const maxPage = totalItems > 0 ? Math.max(0, Math.ceil(totalItems / limit) - 1) : 0
    return Math.min(pageNumber, maxPage)
  }, [pageNumber, totalItems, limit])

  useEffect(() => {
    if (totalItems > 0 && pageNumber > effectivePage) {
      setPageNumber(effectivePage)
    }
  }, [totalItems, pageNumber, limit, effectivePage, setPageNumber])

  const handleSearchSubmit = useCallback(() => {
    setPageNumber(0)
    refetchUsers()
  }, [refetchUsers, setPageNumber])

  const handleRefresh = useCallback(() => {
    setPageNumber(0)
    setPattern('')
    invalidateQueriesByKey(queryClient, getGetUserQueryKey())
  }, [queryClient, setPageNumber])

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

  const columns: ColumnDef<UserTableRowData>[] = useMemo(
    () => [
      { key: 'displayName', label: t('fields.name') },
      { key: 'userId', label: t('fields.userName') },
      { key: 'mail', label: t('fields.email') },
    ],
    [t],
  )

  const actions = useMemo(() => {
    const list: Array<{
      icon: React.ReactNode
      tooltip: string
      id?: string
      onClick: (row: UserTableRowData) => void
    }> = []

    if (canWriteUsers) {
      list.push({
        icon: <Edit className={classes.actionIcon} />,
        tooltip: t('tooltips.edit_user'),
        id: 'editUser',
        onClick: handleGoToUserEditPage,
      })
      list.push({
        icon: <LockOpenIcon className={classes.actionIcon} />,
        tooltip: t('messages.credentials'),
        id: 'userCredentials',
        onClick: handleView2FADetails,
      })
    }

    if (canDeleteUsers) {
      list.push({
        icon: <DeleteOutlined className={classes.actionIcon} />,
        tooltip: t('tooltips.delete_user'),
        id: 'deleteUser',
        onClick: (row) => {
          setDeleteData(row)
          toggle()
        },
      })
    }

    return list
  }, [
    canWriteUsers,
    canDeleteUsers,
    t,
    handleGoToUserEditPage,
    handleView2FADetails,
    classes.actionIcon,
    toggle,
  ])

  const pagination: PaginationConfig = useMemo(
    () => ({
      page: effectivePage,
      rowsPerPage: limit,
      totalItems,
      rowsPerPageOptions: LIMIT_OPTIONS,
      onPageChange: handlePageChange,
      onRowsPerPageChange: handleRowsPerPageChange,
    }),
    [effectivePage, limit, totalItems, LIMIT_OPTIONS, handlePageChange, handleRowsPerPageChange],
  )

  const getRowKey = useCallback(
    (row: UserTableRowData, index: number) => row.inum ?? row.userId ?? `no-inum-${index}`,
    [],
  )

  const searchLabel = useMemo(() => `${t('fields.search', { defaultValue: 'Search' })}:`, [t])
  const searchPlaceholder = useMemo(() => t('placeholders.search', { defaultValue: 'Search' }), [t])

  const primaryAction = useMemo(
    () =>
      canWriteUsers
        ? {
            label: t('tooltips.add_user', { defaultValue: 'Add user' }),
            icon: <Add className={classes.addIcon} />,
            onClick: handleGoToUserAddPage,
          }
        : undefined,
    [canWriteUsers, t, handleGoToUserAddPage, classes.addIcon],
  )

  const emptyMessage = useMemo(() => t('messages.no_data_available'), [t])

  const renderExpandedRow = useCallback(
    (row: UserTableRowData) => <UserDetailViewPage row={{ rowData: row }} />,
    [],
  )

  return (
    <GluuLoader blocking={loading}>
      <User2FADevicesModal
        isOpen={isViewDetailModalOpen}
        onClose={handleClose2FAModal}
        userDetails={selectedUserFor2FA}
        theme={selectedTheme}
      />
      <div className={classes.page}>
        <GluuViewWrapper canShow={canReadUsers}>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={searchLabel}
                searchPlaceholder={searchPlaceholder}
                searchValue={pattern}
                searchOnType
                onSearch={setPattern}
                onSearchSubmit={handleSearchSubmit}
                onRefresh={canReadUsers ? handleRefresh : undefined}
                primaryAction={primaryAction}
              />
            </div>
          </div>

          <div className={classes.tableCard}>
            <GluuTable<UserTableRowData>
              columns={columns}
              data={usersList}
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
          feature={adminUiFeatures.users_delete}
          label={
            modal && deleteData
              ? `${t('messages.action_deletion_for')} ${t('messages.user_entity')} (${[deleteData.displayName, deleteData.userId, deleteData.inum].filter(Boolean).join(' - ')})`
              : ''
          }
        />
      </div>
    </GluuLoader>
  )
}
export default React.memo(UserList)
