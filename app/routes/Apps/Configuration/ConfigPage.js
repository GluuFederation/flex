import React, { useEffect } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  Badge,
  Col,
  Form,
  FormGroup,
  Container,
  Input,
  Card,
  CardBody,
} from './../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import { connect } from 'react-redux'
import {
  getJsonConfig,
  patchJsonConfig,
} from '../../../redux/actions/JsonConfigActions'

function ConfigPage({ configuration, loading, dispatch }) {
  console.log('===================' + JSON.stringify(configuration))
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
