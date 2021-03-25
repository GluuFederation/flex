import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from './../../../components'
import CustomScriptForm from './CustomScriptForm'
import { addCustomScript } from '../../../redux/actions/CustomScriptActions'
function CustomScriptAddPage({ scripts, dispatch }) {
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      dispatch(addCustomScript(data))
      history.push('/scripts')
    }
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <CustomScriptForm item={new Object()} scripts={scripts} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    scripts: state.customScriptReducer.items,
    loading: state.customScriptReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(CustomScriptAddPage)
