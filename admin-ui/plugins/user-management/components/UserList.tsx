import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import MaterialTable, { Action } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Paper, TablePagination } from '@mui/material'
import UserDetailViewPage from './UserDetailViewPage'
import {
  getUsers,
  setSelectedUserData,
  deleteUser,
  getUser2FADetails,
  updateUser,
} from '../redux/features/userSlice'

import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { useDispatch, useSelector } from 'react-redux'
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
import { deleteFido2DeviceData } from '../../fido/redux/features/fidoSlice'
import UserDeviceDetailViewPage from './UserDeviceDetailViewPage'
import {
  CustomAttribute,
  User2FAPayload,
  SearchOptions,
  UserListRootState,
  DeviceData,
  UserTableRowData,
  OTPDevicesData,
  OTPDevice,
  FidoRegistrationEntry,
  CustomUser,
} from '../types'

function UserList(): JSX.Element {
  const { hasCedarPermission, authorize } = useCedarling()
  const dispatch = useDispatch()
  const renders = useRef(0)
  const opt: SearchOptions = {}

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
    opt.limit = 10
    dispatch(getUsers(opt))
    dispatch(getRoles({}))
  }, [dispatch])

  const { totalItems, fidoDetails } = useSelector((state: UserListRootState) => state.userReducer)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const usersList = useSelector((state: UserListRootState) => state.userReducer.items) || []
  const loading = useSelector((state: UserListRootState) => state.userReducer.loading)
  const token = useSelector((state: UserListRootState) => state.authReducer.token.access_token)
  const { t } = useTranslation()
  const [modal, setModal] = useState<boolean>(false)
  const [isViewDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false)
  const [faDetails, setFADetails] = useState<DeviceData[]>([])
  const [otpDevicesList, setOTPDevicesList] = useState<DeviceData[]>([])
  const [userDetails, setUserDetails] = useState<UserTableRowData | null>(null)
  const [deleteData, setDeleteData] = useState<UserTableRowData | null>(null)
  const toggle = (): void => setModal(!modal)
  const submitForm = (message: string): void => {
    toggle()
    if (deleteData) {
      deleteData.action_message = message
      handleUserDelete(deleteData)
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
  const options: SearchOptions = {}
  const navigate = useNavigate()
  function handleGoToUserAddPage(): void {
    dispatch(setSelectedUserData(null))
    navigate('/user/usermanagement/add')
  }

  async function handleView2FADetails(row: UserTableRowData): Promise<void> {
    setUserDetails(row)
    const getOTPDevices =
      row?.customAttributes?.filter((item: CustomAttribute) => item.name === 'jansOTPDevices') || []
    const getOTPDevicesValue = getOTPDevices.map((item: CustomAttribute) =>
      JSON.parse(item.value || '{}'),
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
    const payload: User2FAPayload = {
      username: (row.givenName || '').toLowerCase(),
      token: token,
    }
    dispatch(getUser2FADetails(payload))
    setIsDetailModalOpen(!isViewDetailModalOpen)
  }

  function handleGoToUserEditPage(row: UserTableRowData): void {
    dispatch(setSelectedUserData(row as unknown as CustomUser))
    navigate(`/user/usermanagement/edit/:${row.tableData?.uuid || ''}`)
  }

  const [limit, setLimit] = useState<number>(10)
  const [pattern, setPattern] = useState<string | undefined>(undefined)
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
        dispatch(getUsers({ limit: memoLimit, pattern: memoPattern }))
      }
    }
  }

  function handleUserDelete(row: UserTableRowData): void {
    if (row.inum) {
      dispatch(deleteUser(row))
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
        setLimit(memoLimit)
        setPattern(memoPattern)
        dispatch(getUsers({ limit: memoLimit, pattern: memoPattern }))
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
    const startCount = page * limit
    options.startIndex = startCount
    options.limit = limit
    options.pattern = pattern
    setPageNumber(page)
    dispatch(getUsers(options))
  }

  const onRowCountChangeClick = (count: number): void => {
    options.limit = count
    options.pattern = pattern
    setPageNumber(0)
    setLimit(count)
    dispatch(getUsers(options))
  }

  const updateUserData = (values: string): void => {
    if (!userDetails) return

    const submitableValues = {
      customUser: {
        inum: userDetails.inum,
        userId: userDetails.userId || '',
        dn: userDetails.dn,
        jansOTPDevices: values,
      },
    }
    dispatch(updateUser(submitableValues))
  }

  const handleRemove2Fa = (row: DeviceData): void => {
    if (row.type === 'FIDO2' || row.type === 'SUPER GLUU') {
      dispatch(deleteFido2DeviceData(row.id || ''))
    } else if (row.type === 'OTP') {
      const getOTPDevices =
        userDetails?.customAttributes?.filter(
          (item: CustomAttribute) => item.name === 'jansOTPDevices',
        ) || []
      const getOTPDevicesValue = getOTPDevices.map((item: CustomAttribute) =>
        JSON.parse(item.value || '{}'),
      )

      if (getOTPDevicesValue.length > 0) {
        const removedDevice =
          getOTPDevicesValue[0].devices?.filter((item: OTPDevice) => item.id !== row.id) || []
        const jansOTPDevices = { devices: removedDevice }
        updateUserData(JSON.stringify(jansOTPDevices))
      }
    }

    if (userDetails) {
      handleView2FADetails(userDetails)
    }
  }

  useEffect(() => {
    const usedAttributes: string[] = []
    if (usersList?.length && renders.current < 1) {
      renders.current = 1
      for (const user of usersList) {
        if (user.customAttributes) {
          for (const attribute of user.customAttributes) {
            const val = attribute.name
            if (!usedAttributes.includes(val)) {
              usedAttributes.push(val)
            }
          }
        }
      }
      if (usedAttributes.length) {
        dispatch(
          getAttributesRoot({
            options: { pattern: usedAttributes.toString(), limit: 100 },
          }),
        )
      }
    }
  }, [usersList, dispatch])

  useEffect(() => {
    let removeNullValue: DeviceData[] = []
    if (Array.isArray(fidoDetails) && fidoDetails.length > 0) {
      const updatedDetails: DeviceData[] = fidoDetails.map((item: FidoRegistrationEntry) => {
        const attenstationRequest = JSON.parse(item.registrationData?.attenstationRequest || '{}')

        return {
          id: item.id,
          nickName: attenstationRequest.displayName ?? '-',
          modality: item?.deviceData?.platform ?? '-',
          dateAdded: moment(item.creationDate).format('YYYY-MM-DD HH:mm:ss'),
          type: item?.deviceData?.platform ? 'SUPER GLUU' : 'FIDO2',
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

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])
  const LockedOpenIcon = useCallback(() => <LockOpenIcon />, [])

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
        handleClose={() => setIsDetailModalOpen(!isViewDetailModalOpen)}
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
              data={usersList as UserTableRowData[]}
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
