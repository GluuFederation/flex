import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../Gluu/GluuDialog'
import CustomScriptDetailPage from '../Scripts/CustomScriptDetailPage'
import {
  getCustomScripts,
  setCurrentItem,
} from '../../../redux/actions/CustomScriptActions'
//import scripts from './scripts'

function CustomScriptListPage({ scripts, permissions, loading, dispatch }) {
  useEffect(() => {
    dispatch(getCustomScripts())
  }, [])

  const history = useHistory()
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  function getBadgeTheme(status) {
    if (status === 'ACTIVE') {
      return 'primary'
    } else {
      return 'warning'
    }
  }
  function handleGoToCustomScriptAddPage() {
    return history.push('/script/new')
  }
  function handleGoToCustomScriptEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/script/edit:` + row.inum)
  }
  function handleCustomScriptDelete(row) {
    dispatch(setCurrentItem(row))
    setItem(row)
    toggle()
  }
  function onDeletionConfirmed() {
    // perform delete request
    toggle()
  }
  return (
    <React.Fragment>
      {/* START Content */}
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
        title="CustomScripts"
        actions={[
          (rowData) => ({
            icon: 'edit',
            iconProps: {
              color: 'primary',
              id: 'editCustomScript' + rowData.inum,
            },
            tooltip: 'Edit Script',
            onClick: (event, rowData) =>
              handleGoToCustomScriptEditPage(rowData),
            disabled: false,
          }),
          {
            icon: 'add',
            tooltip: 'Add Script',
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => handleGoToCustomScriptAddPage(),
          },
          {
            icon: 'refresh',
            tooltip: 'Refresh Data',
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => {
              dispatch(getCustomScripts())
            },
          },
          (rowData) => ({
            icon: 'delete',
            iconProps: {
              color: 'secondary',
              id: 'deleteCustomScript' + rowData.inum,
            },
            tooltip: 'Delete Custom Script',
            onClick: (event, rowData) => handleCustomScriptDelete(rowData),
            disabled: false,
          }),
        ]}
        options={{
          search: true,
          selection: false,
          pageSize: 10,
          headerStyle: {
            backgroundColor: '#1EB7FF', //#1EB7FF 01579b
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
      {/* END Content */}
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
export default connect(mapStateToProps)(CustomScriptListPage)
