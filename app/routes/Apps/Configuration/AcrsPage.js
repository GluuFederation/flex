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
import { hasPermission, ACR_READ, ACR_WRITE } from '../../../utils/PermChecker'
import GluuSelectRow from '../Gluu/GluuSelectRow'

function AcrsPage({ acrs, scripts, permissions, loading, dispatch }) {
  const authScripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => item.name)
  authScripts.push('simple_password_auth')
  useEffect(() => {
    dispatch(getAcrsConfig())
  }, [])
  const initialValues = {
    defaultAcr: acrs.defaultAcr,
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
                    <GluuSelectRow
                      label="Default Authentication Method(Acr)"
                      name="defaultAcr"
                      value={acrs.defaultAcr}
                      formik={formik}
                      lsize={6}
                      rsize={6}
                      values={authScripts}
                      required
                    ></GluuSelectRow>
                    <FormGroup row></FormGroup>
                    {hasPermission(permissions, ACR_WRITE) && <GluuFooter />}
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
    acrs: state.acrReducer.acrs,
    permissions: state.authReducer.permissions,
    scripts: state.initReducer.scripts,
    loading: state.acrReducer.loading,
  }
}

export default connect(mapStateToProps)(AcrsPage)
