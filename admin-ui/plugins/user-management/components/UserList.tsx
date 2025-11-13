import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import MaterialTable, { Action } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Paper, TablePagination } from '@mui/material'
import UserDetailViewPage from './UserDetailViewPage'
import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { useDispatch } from 'react-redux'
import { Card, CardBody } from '../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useNavigate } from 'react-router-dom'
import { USER_WRITE, USER_READ, USER_DELETE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import SetTitle from 'Utils/SetTitle'
import { getRoles } from 'Plugins/admin/redux/features/apiRoleSlice'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from '../common/Constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import GluuViewDetailModal from '../../../app/routes/Apps/Gluu/GluuViewDetailsModal'
import customColors from '@/customColors'
import moment from 'moment'
import {
  useDeleteFido2Data,
  useGetUser,
  useDeleteUser,
  usePutUser,
  useGetRegistrationEntriesFido2,
  getGetUserQueryKey,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import UserDeviceDetailViewPage from './UserDeviceDetailViewPage'
import {
  CustomAttribute,
  DeviceData,
  UserTableRowData,
  OTPDevicesData,
  OTPDevice,
  FidoRegistrationEntry,
  CustomUser,
} from '../types'
import { updateToast } from 'Redux/features/toastSlice'
import { logUserDeletion, logUserUpdate, getErrorMessage } from '../helper/userAuditHelpers'
import { useUserWebhook } from '../hooks/useUserWebhook'

function UserList(): JSX.Element {
  const { hasCedarPermission, authorize } = useCedarling()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { triggerUserWebhook } = useUserWebhook()
  const renders = useRef(0)

  const { t } = useTranslation()
  const [modal, setModal] = useState<boolean>(false)
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState<boolean>(false)
  const [faDetails, setFADetails] = useState<DeviceData[]>([])
  const [otpDevicesList, setOTPDevicesList] = useState<DeviceData[]>([])
  const [userDetails, setUserDetails] = useState<UserTableRowData | null>(null)
  const [deleteData, setDeleteData] = useState<UserTableRowData | null>(null)

  const [pageNumber, setPageNumber] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [pattern, setPattern] = useState<string | undefined>(undefined)

  // React Query hooks for data fetching
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
        enabled: hasCedarPermission(USER_READ),
      },
    },
  )

  const usersList: UserTableRowData[] = (usersData?.entries as UserTableRowData[]) ?? []
  const totalItems = usersData?.totalEntriesCount || 0
  const loading = loadingUsers

  // FIDO2 registration entries hook - only fetch when username is set
  const { data: fidoRegistrationData, refetch: refetchFido2Details } =
    useGetRegistrationEntriesFido2(userDetails?.userId?.toLowerCase() || '', {
      query: {
        enabled: false, // Don't auto-fetch, we'll trigger manually
      },
    })

  const fidoDetails = fidoRegistrationData?.entries || []

  // Mutations
  const deleteFido2Mutation = useDeleteFido2Data({
    mutation: {
      onSuccess: async () => {
        dispatch(updateToast(true, 'success', t('messages.device_deleted_successfully')))
        if (userDetails) {
          await refetchFido2Details()
        }
      },
      onError: (error: unknown) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })

  const deleteUserMutation = useDeleteUser({
    mutation: {
      onSuccess: async (_data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_deleted_successfully')))
        await logUserDeletion(variables.inum, (deleteData as CustomUser) || undefined)
        if (deleteData) {
          triggerUserWebhook(deleteData as CustomUser)
        }
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
      },
      onError: (error: unknown) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })

  const updateUserMutation = usePutUser({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success', t('messages.user_updated_successfully')))
        await logUserUpdate(data, variables.data as CustomUser)
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey() })
      },
      onError: (error: unknown) => {
        const errMsg = getErrorMessage(error)
        dispatch(updateToast(true, 'error', errMsg))
      },
    },
  })

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async (): Promise<void> => {
      const permissions = [USER_READ, USER_WRITE, USER_DELETE]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing User permissions:', error)
      }
    }

    authorizePermissions()
  }, [authorize])

  useEffect(() => {
    dispatch(getRoles({}))
  }, [dispatch])
  const toggle = (): void => setModal(!modal)
  const submitForm = (message: string): void => {
    toggle()
    if (deleteData?.inum) {
      deleteData.action_message = message
      deleteUserMutation.mutate({ inum: deleteData.inum })
    }
  }
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.user_management'))
  const myActions: (
    | Action<UserTableRowData>
    | ((rowData: UserTableRowData) => Action<UserTableRowData>)
  )[] = []

  const navigate = useNavigate()

  function handleGoToUserAddPage(): void {
    navigate('/user/usermanagement/add')
  }

  async function handleView2FADetails(row: UserTableRowData): Promise<void> {
    setUserDetails(row)
    const getOTPDevices =
      row?.customAttributes?.filter((item: CustomAttribute) => item.name === 'jansOTPDevices') || []
    const getOTPDevicesValue = getOTPDevices.map((item: CustomAttribute) =>
      JSON.parse(typeof item.value === 'string' ? item.value : JSON.stringify(item.value || {})),
    )
    const getDevices = getOTPDevicesValue?.map((item: OTPDevicesData) => [...(item.devices || [])])
    const getDevicesList = getDevices?.flat()
    const otpDevices: DeviceData[] =
      getDevicesList?.map((item: OTPDevice) => {
        return {
          id: item?.id ?? '-',
          nickName: item?.nickName ?? '-',
          modality: item?.soft
            ? 'Soft token - time based (totp)'
            : 'Hard token - time based (totp)',
          dateAdded: moment(new Date((item.addedOn || 0) * 1000).toString()).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          type: 'OTP',
        }
      }) || []
    setOTPDevicesList(otpDevices)

    // Fetch FIDO2 details
    if (row.userId) {
      await refetchFido2Details()
    }
    setIsViewDetailModalOpen(!isViewDetailModalOpen)
  }

  function handleGoToUserEditPage(row: UserTableRowData): void {
    const userData = row as unknown as CustomUser
    const userId = row.tableData?.uuid || row.inum
    if (!userId) return
    navigate(`/user/usermanagement/edit/${encodeURIComponent(userId)}`, {
      state: { selectedUser: userData },
    })
  }

  let memoLimit = limit
  let memoPattern = pattern

  function handleOptionsChange(
    event: React.ChangeEvent<HTMLInputElement> & { keyCode?: number },
  ): void {
    if (event.target.name === 'limit') {
      memoLimit = parseInt(event.target.value, 10)
    } else if (event.target.name === 'pattern') {
      memoPattern = event.target.value
      if (event.keyCode === 13) {
        setLimit(memoLimit)
        setPattern(memoPattern)
        // Refetch with new parameters - React Query will handle it automatically
      }
    }
  }

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

  if (hasCedarPermission(USER_READ)) {
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

  if (hasCedarPermission(USER_WRITE)) {
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
      disabled: !hasCedarPermission(USER_WRITE),
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
      disabled: !hasCedarPermission(USER_WRITE),
    }))
  }

  if (hasCedarPermission(USER_DELETE)) {
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

  const onPageChangeClick = (page: number): void => {
    setPageNumber(page)
    // React Query will automatically refetch with new parameters
  }

  const onRowCountChangeClick = (count: number): void => {
    setPageNumber(0)
    setLimit(count)
    // React Query will automatically refetch with new parameters
  }

  const updateUserData = (values: string): void => {
    if (!userDetails) return

    const submitableValues = {
      inum: userDetails.inum,
      userId: userDetails.userId || '',
      dn: userDetails.dn,
      jansOTPDevices: values,
    }
    updateUserMutation.mutate({ data: submitableValues })
  }

  const handleRemove2Fa = (row: DeviceData): void => {
    if (row.type === 'FIDO2' || row.type === 'SUPER GLUU') {
      deleteFido2Mutation.mutate({ jansId: row.id || '' })
    } else if (row.type === 'OTP') {
      const getOTPDevices =
        userDetails?.customAttributes?.filter(
          (item: CustomAttribute) => item.name === 'jansOTPDevices',
        ) || []
      const getOTPDevicesValue = getOTPDevices.map((item: CustomAttribute) =>
        JSON.parse(typeof item.value === 'string' ? item.value : JSON.stringify(item.value || {})),
      )

      if (getOTPDevicesValue.length > 0) {
        const removedDevice =
          getOTPDevicesValue[0].devices?.filter((item: OTPDevice) => item.id !== row.id) || []
        const jansOTPDevices = { devices: removedDevice }
        updateUserData(JSON.stringify(jansOTPDevices))

        // Update local OTP devices list immediately for better UX
        const updatedOTPDevices = otpDevicesList.filter((device) => device.id !== row.id)
        setOTPDevicesList(updatedOTPDevices)
      }
    }
  }

  useEffect(() => {
    if (!usersList?.length || renders.current >= 1) return
    renders.current = 1

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

  useEffect(() => {
    let removeNullValue: DeviceData[] = []
    if (Array.isArray(fidoDetails) && fidoDetails.length > 0) {
      const updatedDetails: DeviceData[] = fidoDetails.map((item: FidoRegistrationEntry) => {
        // displayName is at the top level of the entry, not inside registrationData
        const displayName = item.displayName || item?.deviceData?.name || '-'

        // Determine device type based on platform presence
        const deviceType = item?.deviceData?.platform ? 'SUPER GLUU' : 'FIDO2'

        // Format modality - use device platform or type
        const modality = item?.deviceData?.platform || item?.registrationData?.type || '-'

        return {
          id: item.id,
          nickName: displayName,
          modality: modality,
          dateAdded: item.creationDate
            ? moment(item.creationDate).format('YYYY-MM-DD HH:mm:ss')
            : '-',
          type: deviceType,
          registrationData: item.registrationData,
          deviceData: item.deviceData,
        }
      })
      removeNullValue = updatedDetails.filter((item: DeviceData) => item)
    }

    setFADetails([...removeNullValue, ...otpDevicesList])
  }, [fidoDetails, otpDevicesList])

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const DetailPanel = useCallback((rowData: { rowData: UserTableRowData }) => {
    return <UserDetailViewPage row={rowData} />
  }, [])

  const DetailPanelForDevices = useCallback((rowData: { rowData: DeviceData }) => {
    return <UserDeviceDetailViewPage row={rowData} />
  }, [])

  const PaginationWrapper = useCallback(
    () => (
      <TablePagination
        component="div"
        count={totalItems}
        page={pageNumber}
        onPageChange={(_event, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) => onRowCountChangeClick(parseInt(event.target.value, 10))}
      />
    ),
    [pageNumber, totalItems, limit],
  )

  return (
    <GluuLoader blocking={loading}>
      <GluuViewDetailModal
        isOpen={isViewDetailModalOpen}
        handleClose={() => setIsViewDetailModalOpen(!isViewDetailModalOpen)}
      >
        <MaterialTable<DeviceData>
          key={limit}
          columns={[
            { title: `${t('fields.nickName')}`, field: 'nickName' },
            { title: `${t('fields.modality')}`, field: 'modality' },
            { title: `${t('fields.dateAdded')}`, field: 'dateAdded' },
            { title: `${t('fields.authType')}`, field: 'type' },
          ]}
          data={faDetails}
          isLoading={loading}
          title=""
          options={{
            search: false,
            paging: false,
            toolbar: false,
            idSynonym: 'inum',
            selection: false,
            rowStyle: () => ({
              backgroundColor: customColors.white,
            }),
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              ...bgThemeColor,
            } as React.CSSProperties,
            actionsColumnIndex: -1,
          }}
          editable={{
            isDeleteHidden: () => false,
            onRowDelete: (oldData: DeviceData) => {
              return new Promise<void>((resolve) => {
                handleRemove2Fa(oldData)
                resolve()
              })
            },
          }}
          detailPanel={DetailPanelForDevices}
        />
      </GluuViewDetailModal>

      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasCedarPermission(USER_READ)}>
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
