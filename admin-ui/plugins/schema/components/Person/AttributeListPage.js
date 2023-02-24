import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Paper, TablePagination } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { Badge } from 'reactstrap'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import AttributeDetailPage from './AttributeDetailPage'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  hasPermission,
  ATTRIBUTE_WRITE,
  ATTRIBUTE_READ,
  ATTRIBUTE_DELETE,
} from 'Utils/PermChecker'
import {
  getAttributes,
  searchAttributes,
  setCurrentItem,
  deleteAttribute,
} from 'Plugins/schema/redux/actions/AttributeActions'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

function AttributeListPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const attributes = useSelector((state) => state.attributeReducer.items)
  const loading = useSelector((state) => state.attributeReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { totalItems, entriesCount } = useSelector(
    (state) => state.attributeReducer,
  )
  const options = {}
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [limit, setLimit] = useState(pageSize)
  const [pageNumber, setPageNumber] = useState(0)
  const [pattern, setPattern] = useState(null)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  useEffect(() => {
    makeOptions()
    dispatch(getAttributes(options))
  }, [])
  const limitId = 'searchLimit'
  const patternId = 'searchPattern'
  const myActions = []
  SetTitle(t('fields.attributes'))

  let memoLimit = limit
  let memoPattern = pattern

  const navigate = useNavigate()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  function handleOptionsChange(event) {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
    }
  }

  const onPageChangeClick = (page) => {
    makeOptions()
    let startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getAttributes(options))
  }
  const onRowCountChangeClick = (count) => {
    makeOptions()
    options['startIndex'] = 0
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getAttributes(options))
  }

  function makeOptions() {
    setPattern(memoPattern)
    options['limit'] = parseInt(memoLimit)
    if (memoPattern) {
      options['pattern'] = memoPattern
    }
  }
  function handleGoToAttributeEditPage(row) {
    dispatch(setCurrentItem(row))
    return navigate(`/attribute/edit:` + row.inum)
  }
  function handleGoToAttributeViewPage(row) {
    dispatch(setCurrentItem(row))
    return navigate(`/attribute/view:` + row.inum)
  }
  function handleAttribueDelete(row) {
    setItem(row)
    toggle()
  }
  function handleGoToAttributeAddPage() {
    return navigate('/attribute/new')
  }

  if (hasPermission(permissions, ATTRIBUTE_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editAttribute' + rowData.inum,
      },
      tooltip: `${t('tooltips.edit_attribute')}`,
      onClick: (event, rowData) => handleGoToAttributeEditPage(rowData),
      disabled: !hasPermission(permissions, ATTRIBUTE_WRITE),
    }))
  }
  if (hasPermission(permissions, ATTRIBUTE_READ)) {
    myActions.push((rowData) => ({
      icon: 'visibility',
      iconProps: {
        id: 'viewAttribute' + rowData.inum,
      },
      tooltip: `${t('tooltips.view_Attribute')}`,
      onClick: (event, rowData) => handleGoToAttributeViewPage(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, ATTRIBUTE_READ)) {
    myActions.push({
      icon: () => (
        <GluuAdvancedSearch
          limitId={limitId}
          limit={limit}
          pattern={pattern}
          patternId={patternId}
          handler={handleOptionsChange}
          showLimit={false}
        />
      ),
      tooltip: `${t('tooltips.advanced_search_options')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }
  if (hasPermission(permissions, ATTRIBUTE_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('tooltips.refresh_data')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        dispatch(searchAttributes(options))
      },
    })
  }
  if (hasPermission(permissions, ATTRIBUTE_DELETE)) {
    myActions.push((rowData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        color: 'secondary',
        id: 'deleteAttribute' + rowData.inum,
      },
      tooltip: `${t('tooltips.delete_attribute')}`,
      onClick: (event, rowData) => handleAttribueDelete(rowData),
      disabled: !hasPermission(permissions, ATTRIBUTE_DELETE),
    }))
  }
  if (hasPermission(permissions, ATTRIBUTE_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('tooltips.add_attribute')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToAttributeAddPage(),
      disabled: !hasPermission(permissions, ATTRIBUTE_WRITE),
    })
  }

  function getBadgeTheme(status) {
    if (status === 'ACTIVE') {
      return `primary-${selectedTheme}`
    } else {
      return 'warning'
    }
  }
  function onDeletionConfirmed() {
    dispatch(deleteAttribute(item.inum))
    navigate('/attributes')
    toggle()
  }
  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, ATTRIBUTE_READ)}>
          <MaterialTable
            key={attributes ? attributes.length : 0}
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
              { title: `${t('fields.inum')}`, field: 'inum' },
              { title: `${t('fields.displayname')}`, field: 'displayName' },
              {
                title: `${t('fields.status')}`,
                field: 'status',
                type: 'boolean',
                render: (rowData) => (
                  <Badge color={getBadgeTheme(rowData.status)}>
                    {rowData.status}
                  </Badge>
                ),
              },
            ]}
            data={attributes}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: true,
              selection: false,
              searchFieldAlignment: 'left',
              pageSize: limit,
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <AttributeDetailPage row={rowData.rowData} />
            }}
          />
        </GluuViewWrapper>
        {hasPermission(permissions, ATTRIBUTE_DELETE) && (
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="attribute"
            onAccept={onDeletionConfirmed}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default AttributeListPage
