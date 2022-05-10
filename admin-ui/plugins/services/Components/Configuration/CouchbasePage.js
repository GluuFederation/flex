import React, { useEffect } from 'react'
import { Formik } from 'formik'
import CouchbaseItem from './CouchbaseItem'
import { Form, FormGroup, Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuRibbon from 'Routes/Apps/Gluu/GluuRibbon'
import { connect } from 'react-redux'
import Alert from '@material-ui/lab/Alert'
import {
  getCouchBaseConfig,
  editCouchBase,
} from 'Plugins/services/redux/actions/CouchbaseActions'

function CouchbasePage({ couchbase, loading, dispatch, persistenceType }) {
  useEffect(() => {
    dispatch(getCouchBaseConfig())
  }, [])

  return (
    <React.Fragment>
      {persistenceType == `couchbase` ? (
        <GluuLoader blocking={loading}>
          <Card>
            <GluuRibbon
              title="titles.couchbase_authentication"
              fromLeft
              doTranslate
            />
            <FormGroup row />
            <FormGroup row />
            <FormGroup row />
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
        </GluuLoader>
      ) : (
        <Card>
          <GluuRibbon
            title="titles.couchbase_authentication"
            fromLeft
            doTranslate
          />
          <FormGroup row />
          <FormGroup row />
          <FormGroup row />
          <CardBody>
            <Alert severity="info">
              The current data store provider is not Couchbase.
            </Alert>
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    couchbase: state.couchbaseReducer.couchbase,
    permissions: state.authReducer.permissions,
    loading: state.couchbaseReducer.loading,
    persistenceType: state.persistenceTypeReducer.type,
  }
}

export default connect(mapStateToProps)(CouchbasePage)
