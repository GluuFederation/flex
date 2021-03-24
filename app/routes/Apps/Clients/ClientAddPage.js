import React from 'react'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import { useHistory } from 'react-router-dom'
import { addClient } from '../../../redux/actions/OpenidClientActions'
function ClientAddPage({ permissions, dispatch }) {
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      dispatch(addClient(data))
      history.push('/clients')
    }
  }
  const item = {}
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
    permissions: state.openidClientReducer.permissions,
  }
}
export default connect(mapStateToProps)(ClientAddPage)
