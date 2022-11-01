import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { Paper, TablePagination } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Badge } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import ScopeDetailPage from '../Scopes/ScopeDetailPage'
import { useTranslation } from 'react-i18next'
import {
  getScopes,
  deleteScope,
  setCurrentItem,
} from 'Plugins/auth-server/redux/actions/ScopeActions'
import {
  hasPermission,
  buildPayload,
  SCOPE_READ,
  SCOPE_WRITE,
  SCOPE_DELETE,
} from 'Utils/PermChecker'
import {
  LIMIT_ID,
  LIMIT,
  PATTERN,
  PATTERN_ID,
  WITH_ASSOCIATED_CLIENTS,
} from 'Plugins/auth-server/common/Constants'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import useAlert from 'Context/alert/useAlert'

function ScopeListPage({ isSuccess, isError }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userAction = {}
  const options = {}
  const clientOptions = {}
  const myActions = []
  const navigate = useNavigate()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const toggle = () => setModal(!modal)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const [pageNumber, setPageNumber] = useState(0)
  const { totalItems, entriesCount } = useSelector(
    (state) => state.scopeReducer,
  )
  const scopes = useSelector((state) => state.scopeReducer.items)
  const loading = useSelector((state) => state.scopeReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { setAlert } = useAlert()

  const alertSeverity = isSuccess ? 'success' : 'error'
  const alertMessage = isSuccess ? t('messages.success_in_saving') : t('messages.error_in_saving')

  SetTitle(t('titles.scopes'))

  let memoLimit = limit
  let memoPattern = pattern

  const tableColumns = [
    { title: `${t('fields.id')}`, field: 'id' },
    {
      title: `${t('menus.clients')}`,
      field: 'dn',
      render: (rowData) => {
        if (!rowData.clients) {
          return 0
        }
        return (
          <Link
            to={`/auth-server/clients?scopeInum=${rowData.inum}`}
            className="common-link"
          >
            {rowData.clients?.length}
          </Link>
        )
      },
    },
    { title: `${t('fields.description')}`, field: 'description' },
    {
      title: `${t('fields.scope_type')}`,
      field: 'scopeType',
      render: (rowData) => (
        <Badge key={rowData.inum} color={`primary-${selectedTheme}`}>
          {rowData.scopeType}
        </Badge>
      ),
    },
  ]

  useEffect(() => {
    makeOptions()
    dispatch(getScopes(options))
  }, [])

  useEffect(() => {
    const alertParam = { 
      open: (isSuccess || isError),
      title: isSuccess ? 'Success' : 'Failed',
      text: alertMessage,
      severity: alertSeverity
    }
    setAlert(alertParam)
  }, [isSuccess, isError])

  function handleOptionsChange(event) {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
    }
  }

  function makeOptions() {
    setLimit(memoLimit)
    setPattern(memoPattern)
    options[LIMIT] = memoLimit
    options[WITH_ASSOCIATED_CLIENTS] = true
    if (memoPattern) {
      options[PATTERN] = memoPattern
    }
  }

  function makeClientOptions() {
    clientOptions[LIMIT] = 200
  }

  function handleGoToScopeAddPage() {
    return navigate('/auth-server/scope/new')
  }
  function handleGoToScopeEditPage(row) {
    dispatch(setCurrentItem(row))
    return navigate(`/auth-server/scope/edit:` + row.inum)
  }

  function handleScopeDelete(row) {
    dispatch(setCurrentItem(row))
    setItem(row)
    toggle()
  }

  function onDeletionConfirmed(message) {
    buildPayload(userAction, message, item.inum)
    dispatch(deleteScope(userAction))
    navigate('/auth-server/scopes')
    toggle()
  }

  if (hasPermission(permissions, SCOPE_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editScope' + rowData.inum,
      },
      tooltip: `${t('messages.edit_scope')}`,
      onClick: (event, rowData) => handleGoToScopeEditPage(rowData),
      disabled: !hasPermission(permissions, SCOPE_WRITE),
    }))
  }

  if (hasPermission(permissions, SCOPE_READ)) {
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
  if (hasPermission(permissions, SCOPE_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary', fontSize: 'large' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        // buildPayload(userAction, SEARCHING_SCOPES, options)
        dispatch(getScopes(options))
      },
    })
  }
  if (hasPermission(permissions, SCOPE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_scope')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToScopeAddPage(),
      disabled: !hasPermission(permissions, SCOPE_WRITE),
    })
  }

  if (hasPermission(permissions, SCOPE_DELETE)) {
    myActions.push((rowData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        color: 'secondary',
        id: 'deleteScope' + rowData.inum,
      },
      tooltip: `${t('Delete Scope')}`,
      onClick: (event, rowData) => handleScopeDelete(rowData),
      disabled: !hasPermission(permissions, SCOPE_DELETE),
    }))
  }

  const onPageChangeClick = (page) => {
    makeOptions()
    const startCount = page * limit
    options['startIndex'] = parseInt(startCount) + 1
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getScopes(options))
  }

  const onRowCountChangeClick = (count) => {
    makeOptions()
    options['startIndex'] = 0
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getScopes(options))
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, SCOPE_READ)}>
          <MaterialTable
            key={limit ? limit : 0}
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
            columns={tableColumns}
            data={scopes}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              columnsButton: true,
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <ScopeDetailPage row={rowData.rowData} />
            }}
          />
        </GluuViewWrapper>
        {hasPermission(permissions, SCOPE_DELETE) && (
          <GluuDialog
            row={item}
            name={item.id}
            handler={toggle}
            modal={modal}
            subject="scope"
            onAccept={onDeletionConfirmed}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default ScopeListPage
