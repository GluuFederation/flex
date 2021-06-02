import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import CustomScriptForm from './CustomScriptForm'
import { addCustomScript } from '../../redux/actions/CustomScriptActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function CustomScriptAddPage({ scripts, dispatch }) {
  const userAction = {}
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      buildPayload(userAction, data.action_message, data)
      dispatch(addCustomScript(userAction))
      history.push('/auth-server/scripts')
    }
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <CustomScriptForm
              item={new Object()}
              scripts={scripts}
              handleSubmit={handleSubmit}
            />
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
