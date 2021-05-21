import React, { useEffect } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  Badge,
  Col,
  Form,
  FormGroup,
  Container,
  Accordion,
  Input,
  Card,
  CardText,
  CardBody,
} from '../../../../app/components'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuInput from '../../../../app/routes/Apps/Gluu/GluuInput'
import GluuBooleanBox from '../../../../app/routes/Apps/Gluu/GluuBooleanInput'
import ConfigEndpointPanel from './ConfigEndpoints'
import ConfigUmaPanel from './ConfigUmaPanel'
import ConfigSessionPanel from './ConfigSessionPanel'
import ConfigBasicPanel from './ConfigBasicPanel'
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
              {/*<ConfigBasicPanel configuration={configuration} />
              <ConfigEndpointPanel configuration={configuration} />
              <ConfigUmaPanel configuration={configuration} />
              <ConfigSessionPanel configuration={configuration} />
  */}

              {Object.keys(configuration).map((propKey, idx) => (
                <PropertyBuilder
                  key={idx}
                  propKey={propKey}
                  propValue={configuration[propKey]}
                  lSize={lSize}
                />
              ))}
              <FormGroup row>
                <GluuLabel label="Work in progress" />
              </FormGroup>
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
