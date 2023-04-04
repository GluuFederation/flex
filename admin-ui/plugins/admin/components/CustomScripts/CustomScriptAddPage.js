import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import CustomScriptForm from './CustomScriptForm'
import { addCustomScript } from 'Plugins/admin/redux/actions/CustomScriptActions'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useSelector } from 'react-redux'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'

function CustomScriptAddPage({ scripts, dispatch, saveOperationFlag, errorInSaveOperationFlag }) {
  const userAction = {}
  const loading  = useSelector((state) => state.customScriptReducer.loading)
  const navigate =useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      navigate('/adm/scripts')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const message = data.customScript.action_message
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(addCustomScript(userAction))
    }
  }
  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <CustomScriptForm
            item={new Object()}
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
    scripts: state.customScriptReducer.items,
    permissions: state.authReducer.permissions,
    saveOperationFlag: state.customScriptReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.customScriptReducer.errorInSaveOperationFlag,
  }
}
export default connect(mapStateToProps)(CustomScriptAddPage)
