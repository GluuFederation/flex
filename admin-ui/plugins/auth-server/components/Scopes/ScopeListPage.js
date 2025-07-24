import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'
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
  deleteScope,
} from 'Plugins/auth-server/redux/features/scopeSlice'
import { buildPayload, SCOPE_READ, SCOPE_WRITE, SCOPE_DELETE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
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
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'

function ScopeListPage() {
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [myActions, setMyActions] = useState([])

  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const { totalItems } = useSelector((state) => state.scopeReducer)
  const scopes = useSelector((state) => state.scopeReducer.items)
  const loading = useSelector((state) => state.scopeReducer.loading)
  const { permissions } = useSelector((state) => state.cedarPermissions)

  const toggle = useCallback(() => setModal(!modal), [modal])

  SetTitle(t('titles.scopes'))

  // Permission initialization
  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [SCOPE_READ, SCOPE_WRITE, SCOPE_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
  }, [])

  useEffect(() => {}, [permissions])

  const userAction = useMemo(() => ({}), [])
  const options = useMemo(() => ({}), [])

  let memoLimit = limit
  let memoPattern = pattern

  const tableColumns = useMemo(
    () => [
      { title: `${t('fields.id')}`, field: 'id' },
      {
        title: `${t('menus.clients')}`,
        field: 'dn',
        render: (rowData) => {
          if (!rowData.clients) {
            return 0
          }
          return (
            <Link to={`/auth-server/clients?scopeInum=${rowData.inum}`} className="common-link">
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
    ],
    [t, selectedTheme],
  )

  useEffect(() => {
    makeOptions()
    dispatch(getScopes({ action: options }))
  }, [dispatch, options])

  // Build actions based on permissions
  useEffect(() => {
    const actions = []

    if (hasCedarPermission(SCOPE_WRITE)) {
      actions.push((rowData) => ({
        icon: 'edit',
        iconProps: {
          id: 'editScope' + rowData.inum,
        },
        tooltip: `${t('messages.edit_scope')}`,
        onClick: (event, rowData) => handleGoToScopeEditPage(rowData),
        disabled: !hasCedarPermission(SCOPE_WRITE),
      }))
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_scope')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => handleGoToScopeAddPage(),
        disabled: !hasCedarPermission(SCOPE_WRITE),
      })
    }

    if (hasCedarPermission(SCOPE_READ)) {
      actions.push({
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
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {},
      })

      actions.push({
        icon: 'refresh',
        tooltip: `${t('messages.refresh')}`,
        iconProps: {
          color: 'primary',
          fontSize: 'large',
          style: { color: customColors.lightBlue },
        },
        isFreeAction: true,
        onClick: () => {
          makeOptions()
          dispatch(searchScopes({ action: options }))
        },
      })
    }

    if (hasCedarPermission(SCOPE_DELETE)) {
      actions.push((rowData) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteScope' + rowData.inum,
        },
        tooltip: `${t('Delete Scope')}`,
        onClick: (event, rowData) => handleScopeDelete(rowData),
        disabled: !hasCedarPermission(SCOPE_DELETE),
      }))
    }

    setMyActions(actions)
  }, [hasCedarPermission, t, limit, pattern, dispatch, options])

  function handleOptionsChange(event) {
    console.log('event.target.name', event.target.name)

    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
      console.log('memoPattern', memoPattern)
      if (event.keyCode === 13) {
        makeOptions()
        dispatch(getScopes({ action: options }))
      }
    }
  }

  function makeOptions() {
    setLimit(memoLimit)
    setPattern(memoPattern)
    options[LIMIT] = memoLimit
    options[WITH_ASSOCIATED_CLIENTS] = true
    options[PATTERN] = memoPattern
  }

  const handleGoToScopeAddPage = useCallback(() => {
    return navigate('/auth-server/scope/new')
  }, [navigate])

  const handleGoToScopeEditPage = useCallback(
    (row) => {
      dispatch(setCurrentItem({ item: row }))
      return navigate(`/auth-server/scope/edit/:` + row.inum)
    },
    [dispatch, navigate],
  )

  const handleScopeDelete = useCallback(
    (row) => {
      dispatch(setCurrentItem({ item: row }))
      setItem(row)
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    (message) => {
      buildPayload(userAction, message, item)
      dispatch(deleteScope({ action: userAction }))
      navigate('/auth-server/scopes')
      toggle()
    },
    [userAction, item, dispatch, navigate, toggle],
  )

  const onPageChangeClick = useCallback(
    (page) => {
      makeOptions()
      const startCount = page * limit
      options['startIndex'] = parseInt(startCount)
      options['limit'] = limit
      setPageNumber(page)
      dispatch(getScopes({ action: options }))
    },
    [limit, options, dispatch],
  )

  const onRowCountChangeClick = useCallback(
    (count) => {
      makeOptions()
      options['startIndex'] = 0
      options['limit'] = count
      setPageNumber(0)
      setLimit(count)
      dispatch(getScopes({ action: options }))
    },
    [options, dispatch],
  )

  const tableOptions = useMemo(
    () => ({
      idSynonym: 'inum',
      columnsButton: true,
      search: false,
      selection: false,
      pageSize: limit,
      headerStyle: {
        ...applicationStyle.tableHeaderStyle,
        ...bgThemeColor,
      },
      actionsColumnIndex: -1,
    }),
    [limit, bgThemeColor],
  )

  const detailPanel = useCallback((rowData) => {
    return <ScopeDetailPage row={rowData.rowData} />
  }, [])

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(SCOPE_READ)}>
          <MaterialTable
            key={limit ? limit : 0}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Pagination: () => (
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
            }}
            columns={tableColumns}
            data={scopes}
            isLoading={loading}
            title=""
            actions={myActions}
            options={tableOptions}
            detailPanel={detailPanel}
          />
        </GluuViewWrapper>
        {hasCedarPermission(SCOPE_DELETE) && (
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
