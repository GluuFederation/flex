import React, { useEffect } from 'react'
import { Formik } from 'formik'
import CouchbaseItem from './CouchbaseItem'
import { Form, FormGroup, Card, CardBody } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import { connect } from 'react-redux'
import Alert from '@material-ui/lab/Alert';
import {
  getCouchBaseConfig,
  editCouchBase,
} from '../../redux/actions/CouchbaseActions'

function CouchbasePage({ couchbase, loading, dispatch, persistenceType }) {
  useEffect(() => {
    dispatch(getCouchBaseConfig())
  }, [])

  return (
    <React.Fragment>
      {persistenceType == `couchbase` ?
        (<GluuLoader blocking={loading}>
          <Card>
            <CardBody>
              <Formik
                initialValues={couchbase}
                onSubmit={(values) => {
                  dispatch(editCouchBase(JSON.stringify(values)))
                }}
                enableReinitialize
                render={(formik) => {
                  return (
                    <Form onSubmit={formik.handleSubmit}>
                      {couchbase &&
                        couchbase.length &&
                        couchbase.map((couchbaseItem, index) => (
                          <CouchbaseItem
                            key={index}
                            couchbase={couchbaseItem}
                            index={index}
                            formik={formik}
                          ></CouchbaseItem>
                        ))}
                      <FormGroup row></FormGroup>
                    </Form>
                  )
                }}
              ></Formik>
            </CardBody>
          </Card>
        </GluuLoader>) : (<Alert severity="info">The database of Authentication server is not Couchbase.</Alert>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    couchbase: state.couchbaseReducer.couchbase,
    permissions: state.authReducer.permissions,
    loading: state.couchbaseReducer.loading,
    persistenceType: state.persistenceTypeReducer.type
  }
}

export default connect(mapStateToProps)(CouchbasePage)
