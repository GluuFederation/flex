import React from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'

function ClientAddPage() {
  const item = {}
  return (
    <React.Fragment>
      <ClientWizardForm client={item} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.openidClientReducer.permissions,
  }
}
export default connect(mapStateToProps)(ClientAddPage)
