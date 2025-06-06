import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Box, IconButton, Paper, TablePagination } from '@mui/material'
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
  setCurrentItem,
  getScopes,
  searchScopes,
  deleteScope
} from 'Plugins/auth-server/redux/features/scopeSlice'
import {
  hasPermission,
  buildPayload,
  SCOPE_READ,
  SCOPE_WRITE,
  SCOPE_DELETE
} from 'Utils/PermChecker'
import {
  LIMIT_ID,
  LIMIT,
  PATTERN,
  PATTERN_ID,
  WITH_ASSOCIATED_CLIENTS
} from 'Plugins/auth-server/common/Constants'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { Add, FilterList, Refresh } from '@mui/icons-material'
import CustomColumnsToggle from './ScopeCustomColumnToggle'
import ScopeFilter from './ScopeFilter'

function ScopeListPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [myActions, setMyActions] = useState([])
  const [tableColumns] = useState([
    { title: `${t('fields.id')}`, field: 'id' },
    {
      title: `${t('menus.clients')}`,
      field: 'dn',
      render: rowData => {
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
      }
    },
    { title: `${t('fields.description')}`, field: 'description' },
    {
      title: `${t('fields.scope_type')}`,
      field: 'scopeType',
      render: rowData => (
        <Badge key={rowData.inum} color={`primary-${selectedTheme}`}>
          {rowData.scopeType}
        </Badge>
      )
    }
  ])
  const [visibleColumns, setVisibleColumns] = React.useState(
    tableColumns.map(col => col.field)
  )
  const [pageNumber, setPageNumber] = useState(0)
  const [showFiltersBlock, setShowFiltersBlock] = useState(true)

  const toggle = () => setModal(!modal)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const { totalItems, entriesCount } = useSelector(state => state.scopeReducer)
  const scopes = useSelector(state => state.scopeReducer.items)
  const loading = useSelector(state => state.scopeReducer.loading)
  const permissions = useSelector(state => state.authReducer.permissions)

  // Get applied filter state from Redux
  const appliedFilterKey = useSelector(
    state => state.scopeReducer.appliedFilterKey
  )
  const appliedFilterValue = useSelector(
    state => state.scopeReducer.appliedFilterValue
  )

  const canRead = hasPermission(permissions, SCOPE_READ)
  const canWrite = hasPermission(permissions, SCOPE_WRITE)
  const canDelete = hasPermission(permissions, SCOPE_DELETE)

  useEffect(() => {
    // Apply existing filters from Redux state when component mounts
    makeOptions(appliedFilterKey, appliedFilterValue)
    dispatch(getScopes({ action: options }))

    const arr = []

    if (canWrite) {
      arr.push({
        icon: () => buttonIcon('add'),
        tooltip: `${t('messages.add_scope')}`,
        isFreeAction: true,
        onClick: handleGoToScopeAddPage,
        disabled: !canWrite
      })

      arr.push(rowData => ({
        icon: 'edit',
        iconProps: {
          id: 'editScope' + rowData.inum
        },
        tooltip: `${t('messages.edit_scope')}`,
        onClick: (event, rowData) => handleGoToScopeEditPage(rowData),
        disabled: !canWrite
      }))
    }

    if (canRead) {
      arr.push({
        icon: () => buttonIcon('filter'),
        tooltip: `${t('titles.filters')}`,
        isFreeAction: true,
        onClick: toggleFilter
      })

      arr.push({
        icon: () => buttonIcon('refresh'),
        tooltip: `${t('messages.refresh')}`,
        isFreeAction: true,
        onClick: () => {
          makeOptions(appliedFilterKey, appliedFilterValue)
          dispatch(searchScopes({ action: options }))
        }
      })
    }

    if (canDelete) {
      arr.push(rowData => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteScope' + rowData.inum
        },
        tooltip: `${t('Delete Scope')}`,
        onClick: (event, rowData) => handleScopeDelete(rowData),
        disabled: !canDelete
      }))
    }
    setMyActions(arr)
  }, [appliedFilterKey, appliedFilterValue])

  SetTitle(t('titles.scopes'))

  const userAction = {}
  const options = {}

  // 🔐 Permissions

  // 🎨 Styles
  const iconStyle = {
    ...applicationStyle.barIcon,
    color: themeColors.background,
    '&:hover': {
      ...applicationStyle.hoverBarIcon
    }
  }

  // 🖼 Reusable Render Helpers
  const buttonIcon = prop => {
    const iconMap = {
      add: <Add />,
      filter: <FilterList />,
      refresh: <Refresh />
    }

    const titleMap = {
      add: t('titles.add'),
      filter: t('titles.filterValue'),
      refresh: t('titles.refresh')
    }
    return (
      <IconButton size="small" title={titleMap[prop]} sx={{ ...iconStyle }}>
        {iconMap[prop]}
      </IconButton>
    )
  }

  // 📦 Action Handlers
  const handleOptionsChange = (key, val) => {
    makeOptions(key, val)
    dispatch(getScopes({ action: options }))
  }

  const makeOptions = (key = '', val = '') => {
    options[LIMIT] = limit
    options[WITH_ASSOCIATED_CLIENTS] = true
    if (pattern) {
      options[PATTERN] = pattern
    }

    // Use provided parameters first, then fall back to Redux applied filter state
    const filterKeyToUse = key || appliedFilterKey
    const filterValueToUse = val || appliedFilterValue

    if (filterKeyToUse && filterValueToUse) {
      options['fieldValuePair'] = `${
        filterKeyToUse === 'id'
          ? 'jansId'
          : filterKeyToUse === 'scopeType'
            ? 'jansScopeTyp'
            : filterKeyToUse === 'description' && 'description'
      }=${filterValueToUse}`
    }
  }

  const handleGoToScopeAddPage = () => {
    return navigate('/auth-server/scope/new')
  }

  const handleGoToScopeEditPage = row => {
    dispatch(setCurrentItem({ item: row }))
    return navigate(`/auth-server/scope/edit/:` + row.inum)
  }

  const handleScopeDelete = row => {
    dispatch(setCurrentItem({ item: row }))
    setItem(row)
    toggle()
  }

  const onDeletionConfirmed = message => {
    buildPayload(userAction, message, item)
    dispatch(deleteScope({ action: userAction }))
    navigate('/auth-server/scopes')
    toggle()
  }

  // 📊 Pagination Handlers
  const onPageChangeClick = page => {
    makeOptions(appliedFilterKey, appliedFilterValue)
    const startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getScopes({ action: options }))
  }

  const onRowCountChangeClick = count => {
    makeOptions(appliedFilterKey, appliedFilterValue)
    options['startIndex'] = 0
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getScopes({ action: options }))
  }

  // 📃 Column & Filter Logic
  const filteredColumns = tableColumns.filter(col =>
    visibleColumns.includes(col.field)
  )

  const toggleFilter = () => setShowFiltersBlock(prev => !prev)

  // 🧰 Toolbar JSX
  const toolbarMenu = props => (
    <Box
      sx={{
        position: 'relative',
        ...applicationStyle.toolbar
      }}
    >
      {props.actions
        ?.filter(a => a.isFreeAction)
        .map((action, idx) => (
          <span
            key={idx}
            onClick={action.onClick}
            title={action.tooltip}
            style={{ cursor: 'pointer' }}
          >
            {typeof action.icon === 'function' ? action.icon() : null}
          </span>
        ))}

      {showFiltersBlock && (
        <Box sx={{ ...applicationStyle.filterBlock }}>
          <ScopeFilter
            tableColumns={tableColumns}
            visibleColumns={visibleColumns}
            toggleFilter={toggleFilter}
            themeColors={themeColors}
            handleOptionsChange={handleOptionsChange}
            setPageNumber={setPageNumber}
          />
        </Box>
      )}

      <CustomColumnsToggle
        tableColumns={tableColumns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        iconStyle={iconStyle}
        t={t}
      />
    </Box>
  )

  // ⚙️ Actions

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={canRead}>
          <MaterialTable
            key={limit ? limit : 0}
            components={{
              Toolbar: props => toolbarMenu(props),
              Container: props => <Paper {...props} elevation={0} />,
              Pagination: props => (
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
              )
            }}
            columns={filteredColumns}
            data={scopes}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              idSynonym: 'inum',
              columnsButton: false,
              search: false,
              selection: false,
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor
              },
              actionsColumnIndex: -1
            }}
            detailPanel={rowData => {
              return <ScopeDetailPage row={rowData.rowData} />
            }}
          />
        </GluuViewWrapper>
        {canDelete && (
          <GluuDialog
            row={item}
            name={item.id}
            handler={toggle}
            modal={modal}
            subject="scope"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.scopes_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default ScopeListPage
