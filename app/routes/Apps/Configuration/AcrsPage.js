import React, { useEffect } from 'react'
import {
  Col,
  Form,
  FormGroup,
  Container,
  Input,
  Card,
  CardBody,
} from './../../../components'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import GluuLabel from '../Gluu/GluuLabel'
import GluuFooter from '../Gluu/GluuFooter'
import { connect } from 'react-redux'
import { getAcrsConfig, editAcrs } from '../../../redux/actions/AcrsActions'

function AcrsPage({ acrs, permissions, loading, dispatch }) {
  useEffect(() => {
    dispatch(getAcrsConfig())
  }, [])
  const initialValues = {
    defaultAcr: acrs ? acrs.defaultAcr : null,
  }
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        keepInView={true}
        renderChildren={true}
        message={'Performing the request, please wait!'}
      >
        <Container>
          <Card>
            <CardBody>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  const opts = {}
                  opts['authenticationMethod'] = JSON.stringify(values)
                  dispatch(editAcrs(opts))
                }}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <GluuLabel label="Default Acr" required />
                      <Col sm={9}>
                        <Input
                          placeholder="Enter the name of the script that will be use by default."
                          id="defaultAcr"
                          name="defaultAcr"
                          onChange={formik.handleChange}
                          defaultValue={acrs.defaultAcr}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row></FormGroup>
                    <GluuFooter />
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Container>
      </BlockUi>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    acrs: state.acrsReducer.acrs,
    permissions: state.authReducer.permissions,
    loading: state.acrsReducer.loading,
  }
}

export default connect(mapStateToProps)(AcrsPage)
