import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import ScopeForm from './ScopeForm'
import { addScope } from '../../redux/actions/ScopeActions'
import { buildPayload } from '../../../../app/utils/PermChecker'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import {
  getAttributes,
  getScripts
} from '../../../../app//redux/actions/InitActions'
import GluuAlert from '../../../../app/routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'

function ScopeAddPage({ scripts, dispatch, attributes, loading, saveOperationFlag, errorInSaveOperationFlag }) {
  const userAction = {}
  const history = useHistory()
  const { t } = useTranslation()
  useEffect(() => {
    if (attributes.length === 0) {
      buildPayload(userAction, 'Fetch attributes', {})
      dispatch(getAttributes(userAction))
    }
    if (scripts.length === 0) {
      buildPayload(userAction, 'Fetch custom scripts', {})
      dispatch(getScripts(userAction))
    }
  }, [])

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag)
      history.push('/auth-server/scopes')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const postBody = {}
      data = JSON.parse(data)
      let message = data.action_message
      delete data.action_message
      postBody['scope'] = data
      buildPayload(userAction, message, postBody)
      dispatch(addScope(userAction))
    }
  }

  const scope = {
    claims: [],
    dynamicScopeScripts: [],
    defaultScope: false,
    attributes: {
      spontaneousClientId: null,
      spontaneousClientScopes: [],
      showInConfigurationEndpoint: 'false',
    },
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
      <Container>
        <Card className="mb-3">
          <CardBody>
            <ScopeForm
              scope={scope}
              scripts={scripts}
              attributes={attributes}
              handleSubmit={handleSubmit}
            />
          </CardBody>
        </Card>
      </Container>
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.scopeReducer.loading,
    permissions: state.authReducer.permissions,
    scripts: state.initReducer.scripts,
    attributes: state.initReducer.attributes,
    saveOperationFlag: state.scopeReducer.saveOperationFlag,
    errorInSaveOperationFlag: state.scopeReducer.errorInSaveOperationFlag,
  }
}
export default connect(mapStateToProps)(ScopeAddPage)
