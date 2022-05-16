import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import AttributeForm from './AttributeForm'
import { addAttribute } from 'Plugins/schema/redux/actions/AttributeActions'
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
      <Container>
        <Card className="mb-3">
          <CardBody>
            <AttributeForm item={defautAttribute} customOnSubmit={onSubmit} />
          </CardBody>
        </Card>
      </Container>
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
