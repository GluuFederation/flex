import React, { useEffect, useState } from 'react'
import { FormGroup, Card, CardBody } from '../../../../app/components'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import PropertyBuilder from './JsonPropertyBuilder'
import { connect } from 'react-redux'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../redux/actions/JsonConfigActions'

function ConfigPage({ configuration, loading, dispatch }) {
  const lSize = 6
  const [patches, setPatches] = useState([])
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  const patchHandler = (patch) => {
    console.log('==============patch ' + JSON.stringify(patch))
    setPatches((existingPatches) => [...existingPatches, patch])
    const newPatches = patches
    newPatches.push(patch)
    setPatches(newPatches)
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
          <FormGroup row></FormGroup>
          <GluuFooter />
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
