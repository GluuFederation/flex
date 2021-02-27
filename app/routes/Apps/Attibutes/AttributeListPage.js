import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../Gluu/GluuDialog'
import AttributeDetailPage from '../Attibutes/AttributeDetailPage'
import {
  hasPermission,
  ATTRIBUTE_WRITE,
  ATTRIBUTE_DELETE,
} from '../../../utils/PermChecker'
//import attributes from './attributes'
import {
  getAttributes,
  setCurrentItem,
} from '../../../redux/actions/AttributeActions'

function AttributeListPage({ attributes, scopes, dispatch }) {
  useEffect(() => {
    dispatch(getAttributes())
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
  function handleGoToAttributeAddPage() {
    return history.push('/attribute/new')
  }
  function handleGoToAttributeEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/attribute/edit:` + row.inum)
  }
  function handleAttribueDelete(row) {
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
          { title: 'Display Name', field: 'displayName' },
          { title: 'Data Type', field: 'dataType' },
          {
            title: 'Status',
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
        isLoading={false}
        title="Attributes"
        actions={[
          (rowData) => ({
            icon: 'edit',
            iconProps: {
              color: 'primary',
              id: 'editAttribute' + rowData.inum,
            },
            tooltip: 'Edit Attribute',
            onClick: (event, rowData) => handleGoToAttributeEditPage(rowData),
            disabled: !hasPermission(scopes, ATTRIBUTE_WRITE),
          }),
          {
            icon: 'add',
            tooltip: 'Add Attribute',
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => handleGoToAttributeAddPage(),
            disabled: !hasPermission(scopes, ATTRIBUTE_WRITE),
          },
          {
            icon: 'refresh',
            tooltip: 'Refresh Data',
            iconProps: { color: 'primary' },
            isFreeAction: true,
            onClick: () => {
              dispatch(getAttributes())
            },
          },
          (rowData) => ({
            icon: 'delete',
            iconProps: {
              color: 'secondary',
              id: 'deleteAttribute' + rowData.inum,
            },
            tooltip: 'Delete Attribute',
            onClick: (event, rowData) => handleAttribueDelete(rowData),
            disabled: !hasPermission(scopes, ATTRIBUTE_DELETE),
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
          return <AttributeDetailPage row={rowData} />
        }}
      />
      {/* END Content */}
      <GluuDialog
        row={item}
        handler={toggle}
        modal={modal}
        subject="attribute"
        onAccept={onDeletionConfirmed}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    attributes: state.attributeReducer.items,
    loading: state.attributeReducer.loading,
    scopes: state.authReducer.permissions,
    hasApiError: state.attributeReducer.hasApiError,
  }
}
export default connect(mapStateToProps)(AttributeListPage)
