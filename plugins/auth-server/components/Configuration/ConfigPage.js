import React, { useEffect } from 'react'
import { Formik } from 'formik'
import { Form, FormGroup, Card, CardBody } from '../../../../app/components'
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
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody>
          <Form>
            {Object.keys(configuration).map((propKey, idx) => (
              <PropertyBuilder
                key={idx}
                propKey={propKey}
                propValue={configuration[propKey]}
                lSize={lSize}
              />
            ))}
            <FormGroup row></FormGroup>
            <GluuFooter />
          </Form>
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
