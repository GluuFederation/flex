import React from 'react'
import ClientWizardForm from './ClientWizardForm'
import { connect } from 'react-redux'
import { editClient } from '../../../redux/actions/OpenidClientActions'
function ClientEditPage({ item, loading, permissions }) {
  function handleSubmit(data) {
    if (data) {
      dispatch(editClient(data))
      history.push('/clients')
    }
  }
  return (
    <React.Fragment>
      <ClientWizardForm
        client={item}
        permissions={permissions}
        handleSubmit={handleSubmit}
      />
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
