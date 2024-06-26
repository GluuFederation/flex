import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'
import UserDetailViewPage from './UserDetailViewPage'
import {
  getUsers,
  setSelectedUserData,
  deleteUser,
} from '../../redux/features/userSlice'

import { getAttributesRoot } from 'Redux/features/attributesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useNavigate } from 'react-router-dom'
import {
  hasPermission,
  USER_WRITE,
  USER_READ,
  USER_DELETE,
} from 'Utils/PermChecker'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import SetTitle from 'Utils/SetTitle'
import { getRoles } from 'Plugins/admin/redux/features/apiRoleSlice'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from '../../common/Constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

function UserList(props) {
  const dispatch = useDispatch()
  const renders = useRef(0);
  const opt = {}
  useEffect(() => {
    opt['limit'] = 10
    dispatch(getUsers({ action: opt }))
    dispatch(getRoles({}))
  }, [])
  const { totalItems } = useSelector((state) => state.userReducer)
  const [pageNumber, setPageNumber] = useState(0)
  const usersList = useSelector((state) => state.userReducer.items)
  const loading = useSelector((state) => state.userReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const toggle = () => setModal(!modal)
  const submitForm = () => {
    toggle()
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
    options['limit'] = limit
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

  useEffect(() => {
    let usedAttributes = []
    if(usersList?.length && renders.current < 1) {
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
          })
        )
      }
    }
  }, [usersList])

  const PaperContainer = useCallback(
    (props) => <Paper {...props} elevation={0} />,
    []
  )

  const DetailPanel = useCallback((rowData) => {
    return <UserDetailViewPage row={rowData} />
  }, [])

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])

  const PaginationWrapper = useCallback(
    (props) => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(prop, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(prop, count) =>
          onRowCountChangeClick(count.props.value)
        }
      />
    ),
    [pageNumber, totalItems, onPageChangeClick, limit, onRowCountChangeClick]
  )

  return (
    <GluuLoader blocking={loading}>
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
              title=''
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
