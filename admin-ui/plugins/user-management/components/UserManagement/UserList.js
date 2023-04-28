import React, { useEffect, useState, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'
import UserDetailViewPage from './UserDetailViewPage'
import {
  getUsers,
  setSelectedUserData,
  deleteUser,
} from '../../redux/actions/UserActions'

import { getAttributesRoot } from '../../../../app/redux/actions/AttributesActions'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from '../../../../app/components'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from '../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from '../../../../app/routes/Apps/Gluu/styles/applicationstyle'
import { useNavigate } from 'react-router-dom'
import {
  hasPermission,
  USER_WRITE,
  USER_READ,
  USER_DELETE,
} from '../../../../app/utils/PermChecker'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import SetTitle from 'Utils/SetTitle'
import { getRoles } from '../../../admin/redux/actions/ApiRoleActions'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from '../../common/Constants'

function UserList(props) {
  const dispatch = useDispatch()
  const opt = {}
  useEffect(() => {
    opt['limit'] = 10
    dispatch(getUsers(opt))
    dispatch(getAttributesRoot(opt))
    dispatch(getRoles())
  }, [])
  const { totalItems, entriesCount } = useSelector(
    (state) => state.userReducer,
  )
  const [pageNumber, setPageNumber] = useState(0)
  const usersList = useSelector((state) => state.userReducer.items)
  const redirectToUserListPage = useSelector(
    (state) => state.userReducer.redirectToUserListPage,
  )
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
  const userAction = {}
  const navigate =useNavigate()

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
    dispatch(deleteUser(row.inum))
  }

  if (hasPermission(permissions, USER_READ)) {
    myActions.push({
      icon: () => (
        <GluuAdvancedSearch
          limitId={LIMIT_ID}
          patternId={PATTERN_ID}
          limit={limit}
          pattern={pattern}
          handler={handleOptionsChange}
          showLimit={false}
        />
      ),
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
        dispatch(getUsers({ limit: memoLimit, pattern: memoPattern }))
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
      icon: () => <DeleteOutlined />,
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
    dispatch(getUsers(options))
  }
  const onRowCountChangeClick = (count) => {
    
    options['limit'] = count
    options['pattern'] = pattern
    setPageNumber(0)
    setLimit(count)
    dispatch(getUsers(options))
  }

  useEffect(() => {
    let usedAttributes = [];
    for(let i in usersList){
      for(let j in usersList[i].customAttributes){
        let val = usersList[i].customAttributes[j].name
        if(!usedAttributes.includes(val)){
          usedAttributes.push(val);
        }
      }
    }
    if(usedAttributes.length){
      dispatch(getAttributesRoot({pattern:usedAttributes.toString(), limit:100}))
    }
  },[usersList])
  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasPermission(permissions, USER_READ)}>
            {usersList?.length > 0 && (
              <MaterialTable
                key={limit}
                components={{
                  Container: (props) => <Paper {...props} elevation={0} />,
                  Pagination: (props) => (
                    <TablePagination
                      component="div"
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
                  search: true,
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
                detailPanel={(rowData) => {
                  return <UserDetailViewPage row={rowData} />
                }}
              />
            )}
          </GluuViewWrapper>
        </CardBody>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
        />
      </Card>
    </GluuLoader>
  )
}
export default UserList
