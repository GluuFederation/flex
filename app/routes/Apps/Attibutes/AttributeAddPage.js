import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from './../../../components'
import AttributeForm from './AttributeForm'
import { addAttribute } from '../../../redux/actions/AttributeActions'
function AttributeAddPage({ dispatch }) {
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      dispatch(addAttribute(data))
      history.push('/attributes')
    }
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <AttributeForm item={new Object()} handleSubmit={handleSubmit} />
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
