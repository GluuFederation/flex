import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import CustomScriptForm from './CustomScriptForm'
import { editCustomScript } from 'Plugins/admin/redux/actions/CustomScriptActions'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function CustomScriptEditPage({ item, scripts, loading, dispatch, saveOperationFlag, errorInSaveOperationFlag }) {
  const userAction = {}
  const history = useHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      history.push('/adm/scripts')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const message = data.customScript.action_message
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(editCustomScript(userAction))
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
    saveOperationFlag: state.customScriptReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.customScriptReducer.errorInSaveOperationFlag,
  }
}
export default connect(mapStateToProps)(CustomScriptEditPage)
