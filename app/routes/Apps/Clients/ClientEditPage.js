import React from 'react'
import { Container, CardBody, Card } from './../../../components'
import ClientWizardForm from './ClientWizardForm'
import { connect } from 'react-redux'
import BlockUi from 'react-block-ui'

function ClientEditPage({ item, loading }) {
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
export default connect(mapStateToProps)(ClientEditPage)
