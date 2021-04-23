import React, { useEffect } from 'react'
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



function CouchbasePage({ couchbase, loading, dispatch }) {

  useEffect(() => {
    dispatch(getCouchBaseConfig())
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
              <Formik
                initialValues={couchbase}
                onSubmit={(values) => {
                  dispatch(editCouchBase(JSON.stringify(values)))
                }}
                enableReinitialize
                render={formik => {
                  return (
                    <Form onSubmit={formik.handleSubmit}>
                      { (couchbase && couchbase.length) && couchbase.map((couchbaseItem, index) => (
                        <CouchbaseItem
                          key={index}
                          couchbase={couchbaseItem}
                          index={index}
                          formik={formik}
                        ></CouchbaseItem>
                      ))}
                      <FormGroup row></FormGroup>
                      {/* <GluuFooter hideButtons={{save: false}}/> */}
                    </Form>
                  )
                }}
              >
              </Formik>
            </CardBody>
          </Card>
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    couchbase: state.couchBaseReducer.couchbase,
    permissions: state.authReducer.permissions,
    loading: state.couchBaseReducer.loading,
  }
}

export default connect(mapStateToProps)(CouchbasePage)
