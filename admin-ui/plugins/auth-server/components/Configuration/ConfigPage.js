import React, { useEffect, useState } from 'react'
import { FormGroup, Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'
import useExitPrompt from 'Routes/Apps/Gluu/useExitPrompt'
import DefaultAcrInput from './DefaultAcrInput'
import PropertyBuilder from './JsonPropertyBuilder'
import { SIMPLE_PASSWORD_AUTH, FETCHING_SCRIPTS } from 'Plugins/auth-server/common/Constants'
import { connect } from 'react-redux'
import {
  buildPayload,
  hasPermission,
  PROPERTIES_WRITE,
} from 'Utils/PermChecker'
import {
  getJsonConfig,
  patchJsonConfig,
} from 'Plugins/auth-server/redux/actions/JsonConfigActions'
import { FETCHING_JSON_PROPERTIES } from 'Plugins/auth-server/common/Constants'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/actions/AcrsActions'
import { getScripts } from 'Redux/actions/InitActions'
import { useTranslation } from 'react-i18next'

function ConfigPage({ acrs, scripts, configuration, loading, dispatch, permissions }) {
  const lSize = 6
  const userAction = {}
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState([])
  const [operations, setOperations] = useState([])
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(true)
  const [put, setPut] = useState([])
  const { t } = useTranslation()
  const authScripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  authScripts.push(SIMPLE_PASSWORD_AUTH)

  useEffect(() => {
    buildPayload(userAction, FETCHING_JSON_PROPERTIES, {})
    dispatch(getJsonConfig(userAction))
    dispatch(getAcrsConfig())
    dispatch(getScripts(userAction))
  }, [])

  useEffect(() => {
    return () => {
      setShowExitPrompt(false)
    }
  }, [])

  const patchHandler = (patch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
    const newPatches = patches
    newPatches.push(patch)
    setPatches(newPatches)
    setOperations(newPatches)
  }
  const putHandler = (put) => {
    setPut(put)
    setOperations(patches.concat(put))
  }
  function submitForm(message) {
    toggle()
    handleSubmit(message)
  }
  const handleSubmit = (message) => {
    if (patches.length >= 0) {
      const postBody = {}
      postBody['patchRequest'] = patches
      buildPayload(userAction, message, postBody)
      if (!!put) {
        const opts = {}
        opts['authenticationMethod'] = { 'defaultAcr': put.value }
        dispatch(editAcrs(opts))
      }
      dispatch(patchJsonConfig(userAction))
    }
  }
  function toggle() {
    setModal(!modal)
  }
  return (
    <GluuLoader blocking={loading}>
      <Card>
        <GluuRibbon title="titles.jans_json_property" fromLeft doTranslate />
        <CardBody style={{ minHeight: 500 }}>
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          {Object.keys(configuration).map((propKey, idx) => (
            <PropertyBuilder
              key={idx}
              propKey={propKey}
              propValue={configuration[propKey]}
              lSize={lSize}
              handler={patchHandler}
            />
          ))}

          <DefaultAcrInput
            id="defaultAcr"
            name="defaultAcr"
            lsize={lSize}
            rsize={lSize}
            type="select"
            label={t('fields.default_acr')}
            handler={putHandler}
            value={acrs.defaultAcr}
            options={authScripts}
            path={'/ACR'}
          />
          <FormGroup row></FormGroup>
          {hasPermission(permissions, PROPERTIES_WRITE) && (
            <GluuCommitFooter saveHandler={toggle} />
          )}
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          {hasPermission(permissions, PROPERTIES_WRITE) && (
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              operations={operations}
              onAccept={submitForm}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    configuration: state.jsonConfigReducer.configuration,
    permissions: state.authReducer.permissions,
    loading: state.jsonConfigReducer.loading,
    acrs: state.acrReducer.acrs,
    scripts: state.initReducer.scripts,
  }
}

export default connect(mapStateToProps)(ConfigPage)
