import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from './AttributeForm'
import { addAttribute } from 'Plugins/schema/redux/actions/AttributeActions'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function AttributeAddPage({ dispatch }) {
  const history = useHistory()
  function onSubmit(data) {
    if (data) {
      dispatch(addAttribute(data))
      history.push('/attributes')
    }
  }
  const defautAttribute = {
    jansHideOnDiscovery: false,
    selected: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    requred: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
  }
  return (
    <React.Fragment>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm item={defautAttribute} customOnSubmit={onSubmit} />
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.attributeReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(AttributeAddPage)
