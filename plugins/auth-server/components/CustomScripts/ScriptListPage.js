import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { Badge } from 'reactstrap'
import { connect } from 'react-redux'
import GluuDialog from '../../../../app/routes/Apps/Gluu/GluuDialog'
import CustomScriptDetailPage from '../CustomScripts/CustomScriptDetailPage'
import GluuCustomScriptSearch from '../../../../app/routes/Apps/Gluu/GluuCustomScriptSearch'
import {
  deleteCustomScript,
  getCustomScriptByType,
  setCurrentItem,
} from '../../redux/actions/CustomScriptActions'
import {
  hasPermission,
  buildPayload,
  SCRIPT_READ,
  SCRIPT_WRITE,
  SCRIPT_DELETE,
} from '../../../../app/utils/PermChecker'
import { useTranslation } from 'react-i18next'

function ScriptListTable({ scripts, loading, dispatch, permissions }) {
  const { t } = useTranslation()
  const userAction = {}
  const history = useHistory()
  const options = {}
  const myActions = []
  const limitId = 'searchLimit'
  const patternId = 'searchPattern'
  const typeId = 'SearchType'
  const [limit, setLimit] = useState(100)
  const [pattern, setPattern] = useState(null)
  const [type, setType] = useState('PERSON_AUTHENTICATION')
  function makeOptions() {
    options['limit'] = parseInt(limit)
    if (pattern) {
      options['pattern'] = pattern
    }
    if (type && type != '') {
      options['type'] = type
    }
  }
  useEffect(() => {
    makeOptions()
    buildPayload(userAction, 'Fetch custom script', options)
    dispatch(getCustomScriptByType(userAction))
  }, [])
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  if (hasPermission(permissions, SCRIPT_WRITE)) {
    myActions.push((rowData) => ({
      icon: 'edit',
      iconProps: {
        color: 'primary',
        id: 'editCustomScript' + rowData.inum,
      },
      tooltip: `${t("Edit Script")}`,
      onClick: (event, rowData) => handleGoToCustomScriptEditPage(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push({
      icon: () => (
        <GluuCustomScriptSearch
          limitId={limitId}
          limit={limit}
          typeId={typeId}
          patternId={patternId}
          handler={handleOptionsChange}
        />
      ),
      tooltip: `${t("Advanced search options")}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t("Search")}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        buildPayload(userAction, 'Search custom scripts', options)
        dispatch(getCustomScriptByType(userAction))
      },
    })
  }
  if (hasPermission(permissions, SCRIPT_DELETE)) {
    myActions.push((rowData) => ({
      icon: 'delete',
      iconProps: {
        color: 'secondary',
        id: 'deleteCustomScript' + rowData.inum,
      },
      tooltip: `${t("Delete Custom Script")}`,
      onClick: (event, rowData) => handleCustomScriptDelete(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SCRIPT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t("Add Script")}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToCustomScriptAddPage(),
    })
  }
  function handleOptionsChange() {
    setLimit(document.getElementById(limitId).value)
    setPattern(document.getElementById(patternId).value)
    let types = document.getElementById(typeId)
    setType(types.options[types.selectedIndex].text)
  }
  function handleGoToCustomScriptAddPage() {
    return history.push('/auth-server/script/new')
  }
  function handleGoToCustomScriptEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/auth-server/script/edit:` + row.inum)
  }
  function handleCustomScriptDelete(row) {
    setItem(row)
    toggle()
  }
  function onDeletionConfirmed(message) {
    buildPayload(userAction, message, item.inum)
    dispatch(deleteCustomScript(userAction))
    history.push('/auth-server/scripts')
    toggle()
  }
  return (
    <React.Fragment>
      <MaterialTable
        columns={[
          { title: `${t("Inum")}`, field: 'inum' },
          { title: `${t("Name")}`, field: 'name' },
          {
            title: `${t("Enabled")}`,
            field: 'enabled',
            type: 'boolean',
            render: (rowData) => (
              <Badge color={rowData.enabled == 'true' ? 'primary' : 'info'}>
                {rowData.enabled ? 'true' : 'false'}
              </Badge>
            ),
          },
        ]}
        data={scripts}
        isLoading={loading}
        title={t("Scripts")}
        actions={myActions}
        options={{
          search: false,
          searchFieldAlignment: 'left',
          selection: false,
          pageSize: 10,
          rowStyle: (rowData) => ({
            backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
          }),
          headerStyle: {
            backgroundColor: '#03a96d',
            color: '#FFF',
            padding: '2px',
            textTransform: 'uppercase',
            fontSize: '18px',
          },
          actionsColumnIndex: -1,
        }}
        detailPanel={(rowData) => {
          return <CustomScriptDetailPage row={rowData} />
        }}
      />
      <GluuDialog
        row={item}
        handler={toggle}
        modal={modal}
        subject="script"
        onAccept={onDeletionConfirmed}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    scripts: state.customScriptReducer.items,
    loading: state.customScriptReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(ScriptListTable)
