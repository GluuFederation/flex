import React, { useEffect } from 'react'
import { Formik } from 'formik'
import BlockUi from 'react-block-ui'
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
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={'Performing the request, please wait!'}
        >
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
        </BlockUi>
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
