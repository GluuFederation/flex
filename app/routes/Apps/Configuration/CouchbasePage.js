import React, { useEffect, useState } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import CouchbaseItem from './CouchbaseItem'
import {
  Form,
  FormGroup,
  Container,
  Card,
  CardBody,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import { connect } from 'react-redux'
import { getCouchBaseConfig, editCouchBase } from '../../../redux/actions/CouchbaseActions'



function CouchbasePage({ couch, loading, dispatch }) {

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    dispatch(getCouchBaseConfig())
  }, [])

  useEffect(() => {
    if (couch.length) {
      setInitialValues({
        configId: couch[0].configId,
        servers: couch[0].servers,
        connectTimeout: couch[0].connectTimeout,
        computationPoolSize: couch[0].computationPoolSize,
        useSSL: couch[0].useSSL,
      })
    }
  }, [couch])

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
            {Object.keys(initialValues).length && <CardBody>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  dispatch(editCouchBase(JSON.stringify(values)))
                }}
                enableReinitialize
                render={formik => {
                  return (
                    <Form onSubmit={formik.handleSubmit}>
                      {Object.keys(couch).length ? couch.map((couchbase, index) => (
                        <CouchbaseItem
                          key={index}
                          couchbase={couchbase}
                          index={index}
                          formik={formik}
                        ></CouchbaseItem>
                      )) : null}
                      <FormGroup row></FormGroup>
                      <GluuFooter hideButtons={{save: true}}/>
                    </Form>
                  )
                }}
              >
              </Formik>
            </CardBody>}
          </Card>
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    couch: state.couchBaseReducer.couchbase,
    permissions: state.authReducer.permissions,
    loading: state.couchBaseReducer.loading,
  }
}

export default connect(mapStateToProps)(CouchbasePage)
