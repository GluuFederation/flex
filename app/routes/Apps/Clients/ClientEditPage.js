import React from 'react'
import ClientWizardForm from './ClientWizardForm'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { editClient } from '../../../redux/actions/OpenidClientActions'
import BlockUi from 'react-block-ui'

function ClientEditPage({ item, loading, permissions, dispatch }) {
  if (!item.attributes) {
    item.attributes = {
      runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims: false,
      keepClientAuthorizationAfterExpiration: false,
      allowSpontaneousScopes: false,
      backchannelLogoutSessionRequired: false,
    }
  }
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      dispatch(editClient(data))
      history.push('/clients')
    }
  }
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        keepInView={true}
        renderChildren={true}
        message={'Performing the request, please wait!'}
      >
        <ClientWizardForm
          client={item}
          permissions={permissions}
          handleSubmit={handleSubmit}
        />
      </BlockUi>
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
