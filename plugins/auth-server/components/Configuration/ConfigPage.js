import React, { useEffect, useState } from 'react'
import { FormGroup, Card, CardBody, Button } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import PropertyBuilder from './JsonPropertyBuilder'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../redux/actions/JsonConfigActions'

function ConfigPage({ configuration, loading, dispatch }) {
  const { t } = useTranslation()
  const lSize = 6
  const [patches, setPatches] = useState([])
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  const patchHandler = (patch) => {
    setPatches((existingPatches) => [...existingPatches, patch])
    const newPatches = patches
    newPatches.push(patch)
    setPatches(newPatches)
  }
  const handleSubmit = () => {
    if (patches.length >= 0) {
      dispatch(patchJsonConfig(patches))
    }
  }
  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody>
          {Object.keys(configuration).map((propKey, idx) => (
            <PropertyBuilder
              key={idx}
              propKey={propKey}
              propValue={configuration[propKey]}
              lSize={lSize}
              handler={patchHandler}
            />
          ))}
          <FormGroup row>
            <Button color="primary" onClick={handleSubmit}>
              <i className="fa fa-check-circle mr-2"></i>
              {t('actions.save')}
            </Button>
          </FormGroup>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    configuration: state.jsonConfigReducer.configuration,
    permissions: state.authReducer.permissions,
    loading: state.smtpReducer.loading,
  }
}

export default connect(mapStateToProps)(ConfigPage)
