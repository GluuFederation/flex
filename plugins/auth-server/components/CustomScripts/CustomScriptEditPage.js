import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import CustomScriptForm from './CustomScriptForm'
import BlockUi from 'react-block-ui'
import { editCustomScript } from '../../redux/actions/CustomScriptActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function CustomScriptEditPage({ item, scripts, loading, dispatch }) {
  const userAction = {}
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      let message = data.customScript.action_message
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(editCustomScript(userAction))
      history.push('/auth-server/scripts')
    }
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <BlockUi
              tag="div"
              blocking={loading}
              keepInView={true}
              message={'Performing the request, please wait!'}
            >
              <CustomScriptForm
                item={item}
                scripts={scripts}
                handleSubmit={handleSubmit}
              />
            </BlockUi>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    item: state.customScriptReducer.item,
    scripts: state.customScriptReducer.items,
    loading: state.customScriptReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(CustomScriptEditPage)
