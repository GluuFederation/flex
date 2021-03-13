import React from 'react'
import ClientWizardForm from './ClientWizardForm'
import { connect } from 'react-redux'

function ClientEditPage({ item, loading, permissions }) {
  return (
    <React.Fragment>
      <ClientWizardForm client={item} permissions={permissions} />
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    item: state.openidClientReducer.item,
    loading: state.openidClientReducer.loading,
    permissions: state.openidClientReducer.permissions,
  }
}
export default connect(mapStateToProps)(ClientEditPage)
