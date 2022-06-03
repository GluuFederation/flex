import React from 'react'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { connect } from 'react-redux'

function ConfigPage({ loading }) {
  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody style={{ minHeight: 500 }}></CardBody>
      </Card>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.authReducer.permissions,
    loading: state.testReducer.loading,
  }
}

export default connect(mapStateToProps)(ConfigPage)
