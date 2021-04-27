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
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import GluuInput from '../Gluu/GluuInput'
import GluuBooleanBox from '../Gluu/GluuBooleanInput'
import ConfigEndpointPanel from './ConfigEndpoints'
import ConfigUmaPanel from './ConfigUmaPanel'
import ConfigSessionPanel from './ConfigSessionPanel'
import ConfigBasicPanel from './ConfigBasicPanel'
import { connect } from 'react-redux'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../../redux/actions/JsonConfigActions'

function ConfigPage({ configuration, loading, dispatch }) {
  useEffect(() => {
    dispatch(getJsonConfig())
  }, [])
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <ConfigBasicPanel configuration={configuration} />
              <ConfigEndpointPanel configuration={configuration} />
              <ConfigUmaPanel configuration={configuration} />
              <ConfigSessionPanel configuration={configuration} />
              
              <FormGroup row>
                <Col sm={12}>
                  <Accordion className="mb-12 text-white">
                    <Accordion.Header className="d-flex bg-primary text-white align-items-center h6">
                      URIs
                      <Accordion.Indicator className="ml-auto" />
                    </Accordion.Header>
                    &nbsp;
                    <Accordion.Body></Accordion.Body>
                  </Accordion>
                </Col>
              </FormGroup>
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
