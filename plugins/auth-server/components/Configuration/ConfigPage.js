import React, { useEffect } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  Form,
  FormGroup,
  Container,
  Card,
  CardBody,
} from '../../../../app/components'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
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
    <React.Fragment>
      <Container>
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
      </Container>
    </React.Fragment>
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
