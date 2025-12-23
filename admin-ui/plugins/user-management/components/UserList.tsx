import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import MaterialTable, { Action } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Paper, TablePagination } from '@mui/material'
import UserDetailViewPage from './UserDetailViewPage'
import User2FADevicesModal from './User2FADevicesModal'
import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { useDispatch } from 'react-redux'
import { Card, CardBody } from '../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from '../common/Constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import { useGetUser, useDeleteUser, getGetUserQueryKey } from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { UserTableRowData, CustomUser } from '../types'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserDeletion, getErrorMessage } from '../helper/userAuditHelpers'
import { triggerUserWebhook } from '../helper/userWebhookHelpers'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

function UserList(): JSX.Element {
  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const { t } = useTranslation()
  const [modal, setModal] = useState<boolean>(false)
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState<boolean>(false)
  const [selectedUserFor2FA, setSelectedUserFor2FA] = useState<UserTableRowData | null>(null)
  const [deleteData, setDeleteData] = useState<UserTableRowData | null>(null)

  const [pageNumber, setPageNumber] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [pattern, setPattern] = useState<string | undefined>(undefined)

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
      pattern,
      startIndex: pageNumber * limit,
    },
    {
      query: {
        enabled: canReadUsers,
      },
    },
  )

  const usersList: UserTableRowData[] = (usersData?.entries as UserTableRowData[]) ?? []
  const totalItems = usersData?.totalEntriesCount || 0
  const loading = loadingUsers

  const deleteUserMutation = useDeleteUser({
    mutation: {
      onSuccess: async (_data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_deleted_successfully')))
        await logUserDeletion(variables.inum, (deleteData as CustomUser) || undefined)
        await triggerUserWebhook(deleteData as Record<string, unknown>)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
      },
      onError: (error: unknown) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })

  const toggle = (): void => setModal(!modal)
  const submitForm = (message: string): void => {
    toggle()
    if (deleteData?.inum) {
      deleteData.action_message = message
      deleteUserMutation.mutate({ inum: deleteData.inum })
    }
  }
  const themeContext = useContext(ThemeContext)
  const selectedTheme = themeContext?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.user_management'))
  const myActions: (
    | Action<UserTableRowData>
    | ((rowData: UserTableRowData) => Action<UserTableRowData>)
  )[] = []

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
      const userData = { ...row }
      delete userData.tableData
      navigateToRoute(ROUTES.USER_EDIT(userId), { state: { selectedUser: userData as CustomUser } })
    },
    [navigateToRoute],
  )

  const handleOptionsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> & { keyCode?: number }): void => {
      if (event.target.name === 'limit') {
        const newLimit = parseInt(event.target.value, 10)
        setLimit(newLimit)
      } else if (event.target.name === 'pattern') {
        const newPattern = event.target.value
        if (event.keyCode === 13) {
          setPattern(newPattern || undefined)
        }
      }
    },
    [],
  )

  const GluuSearch = useCallback(() => {
    return (
      <GluuAdvancedSearch
        limitId={LIMIT_ID}
        patternId={PATTERN_ID}
        limit={limit}
        pattern={pattern}
        handler={handleOptionsChange}
        showLimit={false}
      />
    )
  }, [limit, pattern, handleOptionsChange])

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])
  const LockedOpenIcon = useCallback(() => <LockOpenIcon />, [])

  if (canReadUsers) {
    myActions.push({
      icon: GluuSearch,
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: {
        color: 'primary',
        style: {
          borderColor: customColors.lightBlue,
        },
      },
      isFreeAction: true,
      onClick: () => {},
    })
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
      isFreeAction: true,
      onClick: () => {
        refetchUsers()
      },
    })
  }

  if (canWriteUsers) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('tooltips.add_user')}`,
      iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
      isFreeAction: true,
      onClick: () => handleGoToUserAddPage(),
    })
    myActions.push((rowData: UserTableRowData) => ({
      icon: 'edit',
      tooltip: `${t('tooltips.edit_user')}`,
      iconProps: {
        id: 'editScope' + (rowData.inum || ''),
        style: { color: customColors.darkGray },
      },
      onClick: (
        _event: React.MouseEvent<HTMLElement>,
        data: UserTableRowData | UserTableRowData[],
      ) => {
        const rowData = Array.isArray(data) ? data[0] : data
        if (rowData) handleGoToUserEditPage(rowData)
      },
      disabled: !canWriteUsers,
    }))
    myActions.push((rowData: UserTableRowData) => ({
      icon: LockedOpenIcon,
      iconProps: {
        id: 'viewDetail' + (rowData.inum || ''),
        style: { color: customColors.darkGray },
      },
      tooltip: `${t('messages.credentials')}`,
      onClick: (
        _event: React.MouseEvent<HTMLElement>,
        data: UserTableRowData | UserTableRowData[],
      ) => {
        const rowData = Array.isArray(data) ? data[0] : data
        if (rowData) handleView2FADetails(rowData)
      },
      disabled: !canWriteUsers,
    }))
  }

  if (canDeleteUsers) {
    myActions.push((rowData: UserTableRowData) => ({
      icon: DeleteOutlinedIcon,
      tooltip: `${t('tooltips.delete_user')}`,
      iconProps: {
        color: 'secondary',
        id: 'deleteClient' + (rowData.inum || ''),
        style: { color: customColors.darkGray },
      },
      onClick: (
        _event: React.MouseEvent<HTMLElement>,
        data: UserTableRowData | UserTableRowData[],
      ) => {
        const rowData = Array.isArray(data) ? data[0] : data
        if (rowData) {
          setDeleteData(rowData)
          toggle()
        }
      },
      disabled: false,
    }))
  }

  const onPageChangeClick = useCallback((page: number): void => {
    setPageNumber(page)
  }, [])

  const onRowCountChangeClick = useCallback((count: number): void => {
    setPageNumber(0)
    setLimit(count)
  }, [])

  useEffect(() => {
    if (!usersList?.length) return

    const usedAttributes = new Set<string>()
    for (const user of usersList) {
      user.customAttributes?.forEach((attribute) => {
        if (attribute.name) {
          usedAttributes.add(attribute.name)
        }
      })
    }

    if (usedAttributes.size > 0) {
      dispatch(
        getAttributesRoot({
          options: { pattern: Array.from(usedAttributes).toString(), limit: 100 },
        }),
      )
    }
  }, [usersList, dispatch])

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const DetailPanel = useCallback((rowData: { rowData: UserTableRowData }) => {
    return <UserDetailViewPage row={rowData} />
  }, [])

  const PaginationWrapper = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(_event, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) => onRowCountChangeClick(parseInt(event.target.value, 10))}
      />
    ),
    [pageNumber, totalItems, limit, onPageChangeClick, onRowCountChangeClick],
  )

  return (
    <GluuLoader blocking={loading}>
      <User2FADevicesModal
        isOpen={isViewDetailModalOpen}
        onClose={handleClose2FAModal}
        userDetails={selectedUserFor2FA}
        theme={selectedTheme}
      />
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={canReadUsers}>
            <MaterialTable<UserTableRowData>
              key={limit}
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={[
                {
                  title: `${t('fields.name')}`,
                  field: 'displayName',
                },
                { title: `${t('fields.userName')}`, field: 'userId' },
                { title: `${t('fields.email')}`, field: 'mail' },
              ]}
              data={usersList}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                search: false,
                idSynonym: 'inum',
                searchFieldAlignment: 'left',
                selection: false,
                pageSize: limit,
                rowStyle: (rowData: UserTableRowData) => ({
                  backgroundColor:
                    rowData.status === 'active' ? themeColors.lightBackground : customColors.white,
                }),
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                } as React.CSSProperties,
                actionsColumnIndex: -1,
              }}
              detailPanel={DetailPanel}
            />
          </GluuViewWrapper>
        </CardBody>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          feature={adminUiFeatures.users_delete}
          onAccept={submitForm}
        />
      </Card>
    </GluuLoader>
  )
}
export default UserList
