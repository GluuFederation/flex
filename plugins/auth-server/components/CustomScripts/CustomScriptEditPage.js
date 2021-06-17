import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CardBody, Card } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import CustomScriptForm from './CustomScriptForm'
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
    <GluuLoader blocking={loading}>
      <Card className="mb-3">
        <CardBody>
          <CustomScriptForm
            item={item}
            scripts={scripts}
            handleSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
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
