import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom'
import { Paper, TablePagination } from '@material-ui/core'
import { Badge } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { Card, CardBody } from 'Components'
import CustomScriptDetailPage from './CustomScriptDetailPage'
import GluuCustomScriptSearch from 'Routes/Apps/Gluu/GluuCustomScriptSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  deleteCustomScript,
  getCustomScriptByType,
  setCurrentItem,
  getCustomScripts,
  viewOnly,
} from 'Plugins/admin/redux/actions/CustomScriptActions'
import {
  hasPermission,
  buildPayload,
  SCRIPT_READ,
  SCRIPT_WRITE,
  SCRIPT_DELETE,
} from 'Utils/PermChecker'
import {
  LIMIT_ID,
  LIMIT,
  PATTERN,
  PATTERN_ID,
  TYPE,
  TYPE_ID,
  FETCHING_SCRIPTS,
  SEARCHING_SCRIPTS,
} from '../../common/Constants'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

function ScriptListTable() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userAction = {}
  const options = {}
  const myActions = []
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const pageSize = localStorage.getItem('paggingSize') || 10
  const [limit, setLimit] = useState(pageSize)
  const [pattern, setPattern] = useState(null)
  const [selectedScripts, setSelectedScripts] = useState(scripts)
  const [type, setType] = useState('person_authentication')
  const toggle = () => setModal(!modal)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const scripts = useSelector((state) => state.customScriptReducer.items)
  const loading = useSelector((state) => state.customScriptReducer.loading)
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { totalItems, entriesCount } = useSelector(
    (state) => state.customScriptReducer,
  )
  const [pageNumber, setPageNumber] = useState(0)
  let memoPattern = pattern
  let memoType = type
  SetTitle(t('titles.scripts'))

  function makeOptions() {
    setPattern(memoPattern)
    setType(memoType)
    options[LIMIT] = parseInt(limit)
    if (memoPattern) {
      options[PATTERN] = memoPattern
    }
    if (memoType != '') {
      options[TYPE] = memoType
    }
  }
  useEffect(() => {
    makeOptions()
    dispatch(getCustomScriptByType(options))
  }, [])
  if (hasPermission(permissions, SCRIPT_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editCustomScript' + rowData.inum,
      },
      tooltip: `${t('messages.edit_script')}`,
      onClick: (event, entry) => handleGoToCustomScriptEditPage(entry),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push((rowData) => ({
      icon: 'visibility',
      iconProps: {
        id: 'viewCustomScript' + rowData.inum,
      },
      tooltip: `${t('messages.view_script_details')}`,
      onClick: (event, rowData) =>
        handleGoToCustomScriptEditPage(rowData, true),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push({
      icon: () => (
        <GluuCustomScriptSearch
          limitId={LIMIT_ID}
          limit={limit}
          typeId={TYPE_ID}
          patternId={PATTERN_ID}
          scriptType={type}
          pattern={pattern}
          handler={handleOptionsChange}
        />
      ),
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
    })
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        dispatch(getCustomScriptByType(options))
      },
    })
  }
  if (hasPermission(permissions, SCRIPT_DELETE)) {
    myActions.push((rowData) => ({
      icon: () => <DeleteOutlined />,
      iconProps: {
        id: 'deleteCustomScript' + rowData.inum,
      },
      tooltip: `${t('messages.delete_script')}`,
      onClick: (event, row) => handleCustomScriptDelete(row),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SCRIPT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_script')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToCustomScriptAddPage(),
    })
  }
  function handleOptionsChange(event) {
    const name = event.target.name
    console.log(name, event.target.value)
    if (name == 'pattern') {
      memoPattern = event.target.value
    } else if (name == 'type') {
      memoType = event.target.value
      makeOptions()
      dispatch(getCustomScriptByType(options))
    }
  }
  function handleGoToCustomScriptAddPage() {
    return navigate('/adm/script/new')
  }
  function handleGoToCustomScriptEditPage(row, edition) {
    dispatch(viewOnly(edition))
    dispatch(setCurrentItem(row))
    return navigate(`/adm/script/edit/:` + row.inum)
  }
  function handleCustomScriptDelete(row) {
    setItem(row)
    toggle()
  }
  function onDeletionConfirmed(message) {
    buildPayload(userAction, message, item.inum)
    dispatch(deleteCustomScript(userAction))
    navigate('/adm/scripts')
    toggle()
  }

  const onPageChangeClick = (page) => {
    makeOptions()
    let startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getCustomScriptByType(options))
  }
  const onRowCountChangeClick = (count) => {
    console.log(count)
    makeOptions()
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getCustomScriptByType(options))
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasPermission(permissions, SCRIPT_READ)}>
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
              { title: `${t('fields.name')}`, field: 'name' },
              { title: `${t('fields.description')}`, field: 'description' },
              {
                title: `${t('options.enabled')}`,
                field: 'enabled',
                type: 'boolean',
                render: (rowData) => (
                  <Badge
                    color={
                      rowData.enabled == true
                        ? `primary-${selectedTheme}`
                        : 'dimmed'
                    }
                  >
                    {rowData.enabled ? 'true' : 'false'}
                  </Badge>
                ),
                defaultSort: 'desc',
              },
            ]}
            data={scripts}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: true,
              searchFieldAlignment: 'left',
              selection: false,
              pageSize: limit,
              rowStyle: (rowData) => ({
                backgroundColor: rowData.enabled && rowData?.scriptError?.stackTrace
                  ? '#FF5858' : rowData.enabled
                    ? themeColors.lightBackground
                    : '#FFF',
              }),
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return <CustomScriptDetailPage row={rowData.rowData} />
            }}
          />
        </GluuViewWrapper>
        {hasPermission(permissions, SCRIPT_DELETE) && (
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="script"
            onAccept={onDeletionConfirmed}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default ScriptListTable
