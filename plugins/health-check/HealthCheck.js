import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getHealthCheck } from '../redux/actions/HealthCheckActions'
import MaterialTable from 'material-table'  
import { Badge } from 'reactstrap'

function HealthCheck({ components, dispatch }) {
  
  useEffect(() => {
    dispatch(getHealthCheck())
  }, []);

  function getBadgeTheme(status) {
    if (status) {
      return 'primary'
    } else {
      return 'Warning'
    }
  }
  function getStatus(status) {
    if (status) {
      return 'Running'
    } else {
      return 'Down/ Not Available'
    }
  }

  return (
    <React.Fragment>
      <MaterialTable
        columns={[
          { title: 'Component Name', field: 'component' },
          { title: 'Address', field: 'componentAddress' },
          {
            title: 'Status',
            field: 'status',
            type: 'boolean',
            render: (rowData) => (
              <Badge color={getBadgeTheme(rowData.status)}>
                {getStatus(rowData.status)}
              </Badge>
            ),
          },
        ]}
        data={components}
        isLoading={false}
        title="Components"
        options={{
          search: false,
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
          return <HealthCheck row={rowData} />
        }}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  console.log(JSON.stringify(state))
  return {
    components: state.healthCheck.components,
    loading: state.healthCheck.loading,
  }
}
export default connect(mapStateToProps)(HealthCheck)
