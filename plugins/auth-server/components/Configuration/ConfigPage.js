import React, { useEffect, useState } from 'react'
import { FormGroup, Card, CardBody } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import GluuCommitFooter from '../../../../app/routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import useExitPrompt from '../../../../app/routes/Apps/Gluu/useExitPrompt'
import PropertyBuilder from './JsonPropertyBuilder'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { buildPayload } from '../../../../app/utils/PermChecker'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../redux/actions/JsonConfigActions'
import { FETCHING_JSON_PROPERTIES } from '../../common/Constants'

function ConfigPage({ configuration, loading, dispatch }) {
  const { t } = useTranslation()
  const lSize = 6
  const userAction = {}
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState([])
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(true)
  useEffect(() => {
    buildPayload(userAction, FETCHING_JSON_PROPERTIES, {})
    dispatch(getJsonConfig())
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
      dispatch(patchJsonConfig(userAction))
    }
  }
  function toggle() {
    setModal(!modal)
  }
  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody style={{ minHeight: 500 }}>
          {Object.keys(configuration).map((propKey, idx) => (
            <PropertyBuilder
              key={idx}
              propKey={propKey}
              propValue={configuration[propKey]}
              lSize={lSize}
              handler={patchHandler}
            />
          ))}
          <FormGroup row></FormGroup>
          <GluuCommitFooter saveHandler={toggle} />
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          <FormGroup row></FormGroup>
          <GluuCommitDialog
            handler={toggle}
            modal={modal}
            operations={patches}
            onAccept={submitForm}
          />
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
  }
}

export default connect(mapStateToProps)(ConfigPage)
