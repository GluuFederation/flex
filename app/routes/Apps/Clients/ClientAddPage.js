import React from 'react'
import { Container } from './../../../components'
import { connect } from 'react-redux'
import ClientWizardForm from './ClientWizardForm'
import BlockUi from 'react-block-ui'

function ClientAddPage({ item, loading }) {
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        keepInView={true}
        renderChildren={true}
        message={'Performing the request, please wait!'}
      >
        <ClientWizardForm client={item} />
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
export default connect(mapStateToProps)(ClientAddPage)
