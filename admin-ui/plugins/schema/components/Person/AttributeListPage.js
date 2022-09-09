import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom'
import { Paper } from '@material-ui/core'
import { connect } from 'react-redux'
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

function AttributeListPage({ attributes, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const options = {}
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [limit, setLimit] = useState(pageSize)
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

  const navigate =useNavigate()
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

  function makeOptions() {
    setLimit(memoLimit)
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
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
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
              pageSize: pageSize,
              headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
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

const mapStateToProps = (state) => {
  return {
    attributes: state.attributeReducer.items,
    loading: state.attributeReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(AttributeListPage)
