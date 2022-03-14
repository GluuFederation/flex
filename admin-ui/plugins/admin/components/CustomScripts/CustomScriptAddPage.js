import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import CustomScriptForm from './CustomScriptForm'
import { addCustomScript } from '../../redux/actions/CustomScriptActions'
import { buildPayload } from '../../../../app/utils/PermChecker'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'

function CustomScriptAddPage({ scripts, dispatch, saveOperationFlag, errorInSaveOperationFlag }) {
  const userAction = {}
  const history = useHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      history.push('/adm/scripts')
  }, [saveOperationFlag])


  function handleSubmit(data) {
    if (data) {
      let message = data.customScript.action_message
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(addCustomScript(userAction))
    }
  }
  return (
    <React.Fragment>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
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
    saveOperationFlag: state.customScriptReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.customScriptReducer.errorInSaveOperationFlag,
  }
}
export default connect(mapStateToProps)(CustomScriptAddPage)
