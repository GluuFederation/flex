import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { Badge } from 'reactstrap'
import { connect } from 'react-redux'
import GluuDialog from '../Gluu/GluuDialog'
import CustomScriptDetailPage from '../Scripts/CustomScriptDetailPage'
import GluuCustomScriptSearch from '../Gluu/GluuCustomScriptSearch'
import {
  getCustomScripts,
  deleteCustomScript,
  setCurrentItem,
} from '../../../redux/actions/CustomScriptActions'
import {
  hasPermission,
  SCRIPT_READ,
  SCRIPT_WRITE,
  SCRIPT_DELETE,
} from '../../../utils/PermChecker'

function ScriptListTable({ scripts, loading, dispatch, permissions }) {
  const history = useHistory()
  const options = {}
  const myActions = []
  const limitId = 'searchLimit'
  const patternId = 'searchPattern'
  const statusId = 'statusId'
  const typeId = 'typeId'
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [status, setStatus] = useState(true)
  const [type, setType] = useState(true)
  function makeOptions() {
    options['limit'] = parseInt(limit)
    if (pattern) {
      options['pattern'] = pattern
    }
    if (status && status != '') {
      options['status'] = status
    }
    if (type && type != '') {
      options['type'] = type
    }
  }
  useEffect(() => {
    makeOptions()
    dispatch(getCustomScripts(options))
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
      tooltip: 'Edit Script',
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
          statusId={statusId}
          typeId={typeId}
          patternId={patternId}
          handler={handleOptionsChange}
        />
      ),
      tooltip: 'Advanced search options',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }
  if (hasPermission(permissions, SCRIPT_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: 'Search',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        makeOptions()
        dispatch(getCustomScripts(options))
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
      tooltip: 'Delete Custom Script',
      onClick: (event, rowData) => handleCustomScriptDelete(rowData),
      disabled: false,
    }))
  }
  if (hasPermission(permissions, SCRIPT_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: 'Add Script',
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => handleGoToCustomScriptAddPage(),
    })
  }
  function handleOptionsChange(i) {
    setLimit(document.getElementById(limitId).value)
    setPattern(document.getElementById(patternId).value)
    setType(document.getElementById(typeId).value)
    setStatus(document.getElementById(statusId).value)
  }
  function handleGoToCustomScriptAddPage() {
    return history.push('/script/new')
  }
  function handleGoToCustomScriptEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/script/edit:` + row.inum)
  }
  function handleCustomScriptDelete(row) {
    setItem(row)
    toggle()
  }
  function onDeletionConfirmed() {
    deleteCustomScript(item.inum)
    history.push('/scripts')
    toggle()
  }
  return (
    <React.Fragment>
      <MaterialTable
        columns={[
          { title: 'Inum', field: 'inum' },
          { title: 'Name', field: 'name' },
          {
            title: 'Enabled',
            field: 'enabled',
            type: 'boolean',
            render: (rowData) => (
              <Badge color={rowData.enabled ? 'primary' : 'info'}>
                {rowData.enabled ? 'true' : 'false'}
              </Badge>
            ),
          },
        ]}
        data={scripts}
        isLoading={loading}
        title="Scripts"
        actions={myActions}
        options={{
          search: false,
          searchFieldAlignment: 'left',
          selection: false,
          pageSize: 10,
          rowStyle: (rowData) => ({
            backgroundColor: rowData.enabled ? '#00FF00' : '#FFF',
          }),
          headerStyle: {
            backgroundColor: '#1EB7FF',
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
