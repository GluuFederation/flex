import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Paper, TablePagination } from '@mui/material'
import UserDetailViewPage from './UserDetailViewPage'
import {
  getUsers,
  setSelectedUserData,
  deleteUser,
  getUser2FADetails,
} from '../../redux/features/userSlice'

import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useNavigate } from 'react-router-dom'
import { hasPermission, USER_WRITE, USER_READ, USER_DELETE } from 'Utils/PermChecker'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import SetTitle from 'Utils/SetTitle'
import { getRoles } from 'Plugins/admin/redux/features/apiRoleSlice'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from '../../common/Constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import GluuViewDetailModal from '../../../../app/routes/Apps/Gluu/GluuViewDetailsModal'

import moment from 'moment'
import { deleteFido2DeviceData } from '../../../fido/redux/features/fidoSlice'
import UserDeviceDetailViewPage from './UserDeviceDetailViewPage'

function UserList(props) {
  const dispatch = useDispatch()
  const renders = useRef(0)
  const opt = {}
  useEffect(() => {
    opt['limit'] = 10
    dispatch(getUsers({ action: opt }))
    dispatch(getRoles({}))
  }, [])
  const { totalItems, fidoDetails } = useSelector((state) => state.userReducer)
  const [pageNumber, setPageNumber] = useState(0)
  const usersList = useSelector((state) => state.userReducer.items)
  const loading = useSelector((state) => state.userReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const token = useSelector((state) => state.authReducer.token.access_token)
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const [isViewDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [faDetails, setFADetails] = useState([])
  const [otpDevicesList, setOTPDevicesList] = useState([])
  const [userDetails, setUserDetails] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const toggle = () => setModal(!modal)
  const submitForm = (message) => {
    toggle()
    deleteData.action_message = message
    handleUserDelete(deleteData)
  }
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.user_management'))

  const myActions = []
  const options = {}
  const navigate = useNavigate()

  function handleGoToUserAddPage() {
    dispatch(setSelectedUserData(null))
    return navigate('/user/usermanagement/add')
  }

  async function handleView2FADetails(row) {
    setUserDetails(row)
    const getOTPDevices = row?.customAttributes.filter((item) => item.name === 'jansOTPDevices')
    const getOTPDevicesValue = getOTPDevices.map((item) => JSON.parse(item.value))
    const getDevices = getOTPDevicesValue?.map((item) => [...item.devices])
    const getDevicesList = getDevices?.flat()
    const otpDevices = getDevicesList?.map((item) => {
      return {
        id: item?.id ?? '-',
        nickName: item?.nickName ?? '-',
        modality: item?.soft ? 'Soft token - time based (totp)' : 'Hard token - time based (totp)',
        dateAdded: moment(new Date(item.addedOn).toString()).format('YYYY-MM-DD HH:mm:ss'),
        type: 'OTP',
      }
    })
    setOTPDevicesList(otpDevices)

    dispatch(getUser2FADetails({ username: row.givenName.toLowerCase(), token: token }))
    setIsDetailModalOpen(!isViewDetailModalOpen)
  }

  function handleGoToUserEditPage(row) {
    dispatch(setSelectedUserData(row))
    return navigate(`/user/usermanagement/edit/:` + row.tableData.uuid)
  }
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)

  let memoLimit = limit
  let memoPattern = pattern

  function handleOptionsChange(event) {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
      if (event.keyCode === 13) {
        setLimit(memoLimit)
        setPattern(memoPattern)
        dispatch(getUsers({ action: { limit: memoLimit, pattern: memoPattern } }))
      }
    }
  }

  function handleUserDelete(row) {
    dispatch(deleteUser(row))
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

  if (hasPermission(permissions, USER_READ)) {
    myActions.push({
      icon: GluuSearch,
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }
  if (hasPermission(permissions, USER_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        setLimit(memoLimit)
        setPattern(memoPattern)
        dispatch(getUsers({ action: { limit: memoLimit, pattern: memoPattern } }))
      },
    })
  }
  if (hasPermission(permissions, USER_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_role')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToUserAddPage(),
    })
  }
  if (hasPermission(permissions, USER_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editScope' + rowData.inum,
      },
      onClick: (event, rowData) => handleGoToUserEditPage(rowData),
      disabled: !hasPermission(permissions, USER_WRITE),
    }))
  }

  if (hasPermission(permissions, USER_READ)) {
    myActions.push((rowData) => ({
      icon: LockedOpenIcon,
      iconProps: {
        id: 'viewDetail' + rowData.inum,
      },
      tooltip: `${t('messages.credentials')}`,
      onClick: (event, rowData) => handleView2FADetails(rowData),
      disabled: !hasPermission(permissions, USER_WRITE),
    }))
  }

  if (hasPermission(permissions, USER_DELETE)) {
    myActions.push((rowData) => ({
      icon: DeleteOutlinedIcon,
      iconProps: {
        color: 'secondary',
        id: 'deleteClient' + rowData.inum,
      },
      onClick: (event, rowData) => {
        setDeleteData(rowData)
        toggle()
      },
      disabled: false,
    }))
  }

  const onPageChangeClick = (page) => {
    let startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limyActionsmit
    options['pattern'] = pattern
    setPageNumber(page)
    dispatch(getUsers({ action: options }))
  }
  const onRowCountChangeClick = (count) => {
    options['limit'] = count
    options['pattern'] = pattern
    setPageNumber(0)
    setLimit(count)
    dispatch(getUsers({ action: options }))
  }

  const updateUserData = (values) => {
    let submitableValues = {
      inum: userDetails.inum,
      userId: userDetails.userId || '',
      dn: userDetails.dn,
      jansOTPDevices: values,
    }
    dispatch(updateUser(submitableValues))
  }

  const handleRemove2Fa = (row) => {
    if (row.type === 'FIDO2' || row.type === 'SUPER GLUU') {
      dispatch(deleteFido2DeviceData(row.id))
    } else if (row.type === 'OTP') {
      const getOTPDevices = userDetails?.customAttributes.filter(
        (item) => item.name === 'jansOTPDevices',
      )
      const getOTPDevicesValue = getOTPDevices.map((item) => JSON.parse(item.value))

      const removedDevice = getOTPDevicesValue[0].devices.filter((item) => item.id !== row.id)
      const jansOTPDevices = { devices: removedDevice }
      updateUserData(JSON.stringify(jansOTPDevices))
    } else return false

    handleView2FADetails(userDetails)
  }

  useEffect(() => {
    let usedAttributes = []
    if (usersList?.length && renders.current < 1) {
      renders.current = 1
      for (let i in usersList) {
        for (let j in usersList[i].customAttributes) {
          let val = usersList[i].customAttributes[j].name
          if (!usedAttributes.includes(val)) {
            usedAttributes.push(val)
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
  }, [usersList])

  useEffect(() => {
    let removeNullValue = []
    if (Object.keys(fidoDetails).length > 0 && fidoDetails?.entries?.length > 0) {
      const updatedDetails = fidoDetails
        ? fidoDetails?.entries?.map((item) => {
            const attenstationRequest = JSON.parse(item.registrationData.attenstationRequest)

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
        : []
      removeNullValue = updatedDetails ? updatedDetails?.filter((item) => item) : []
    }

    setFADetails([...removeNullValue, ...otpDevicesList])
  }, [fidoDetails])

  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const DetailPanel = useCallback((rowData) => {
    return <UserDetailViewPage row={rowData} />
  }, [])

  const DetailPanelForDevices = useCallback((rowData) => {
    return <UserDeviceDetailViewPage row={rowData} />
  }, [])

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])
  const LockedOpenIcon = useCallback(() => <LockOpenIcon />, [])

  const PaginationWrapper = useCallback(
    (props) => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(prop, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(prop, count) => onRowCountChangeClick(count.props.value)}
      />
    ),
    [pageNumber, totalItems, onPageChangeClick, limit, onRowCountChangeClick],
  )

  return (
    <GluuLoader blocking={loading}>
      <GluuViewDetailModal
        isOpen={isViewDetailModalOpen}
        handleClose={() => setIsDetailModalOpen(!isViewDetailModalOpen)}
      >
        <MaterialTable
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
            rowStyle: (rowData) => ({
              backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
            }),
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              ...bgThemeColor,
            },

            actionsColumnIndex: -1,
          }}
          editable={{
            isDeleteHidden: () => false,
            onRowDelete: (oldData) => {
              return new Promise((resolve, reject) => {
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
          <GluuViewWrapper canShow={hasPermission(permissions, USER_READ)}>
            <MaterialTable
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
                rowStyle: (rowData) => ({
                  backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
                }),
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                },
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
