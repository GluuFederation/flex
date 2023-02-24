import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import CouchbaseItem from './CouchbaseItem'
import { Form, FormGroup, Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { connect } from 'react-redux'
import Alert from '@mui/lab/Alert'
import {
  getCouchBaseConfig,
  editCouchBase,
} from 'Plugins/services/redux/actions/CouchbaseActions'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function CouchbasePage({ couchbase, loading, dispatch, persistenceType }) {
  const { t } = useTranslation()
  SetTitle(t('titles.couchbase_authentication'))
  useEffect(() => {
    dispatch(getCouchBaseConfig())
  }, [])

  return (
    <React.Fragment>
      {persistenceType == `couchbase` ? (
        <GluuLoader blocking={loading}>
          <Card style={applicationStyle.mainCard}>
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
        <Card style={applicationStyle.mainCard}>
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
