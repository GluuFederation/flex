import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import CouchbaseItem from './CouchbaseItem'
import { Form, FormGroup, Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch } from 'react-redux'
import Alert from '@mui/material/Alert'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import {
  useGetConfigDatabaseCouchbase,
  usePutConfigDatabaseCouchbase,
  useGetPropertiesPersistence,
  getGetConfigDatabaseCouchbaseQueryKey,
  type CouchbaseConfiguration,
} from 'JansConfigApi'
import { useCouchbaseAudit } from './hooks'
import { isPersistenceInfo } from './types'

function CouchbasePage(): ReactElement {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { logCouchbaseUpdate } = useCouchbaseAudit()

  SetTitle(t('titles.couchbase_authentication'))

  const { data: couchbase, isLoading: loading } = useGetConfigDatabaseCouchbase({
    query: { staleTime: 30000 },
  })

  const { data: persistenceData, isLoading: persistenceLoading } = useGetPropertiesPersistence({
    query: { staleTime: 30000 },
  })

  const persistenceType = isPersistenceInfo(persistenceData)
    ? persistenceData.persistenceType
    : undefined

  const editMutation = usePutConfigDatabaseCouchbase()

  const handleSubmit = async (values: CouchbaseConfiguration[]): Promise<void> => {
    if (!values || values.length === 0) return

    const results = await Promise.allSettled(
      values.map(async (config) => {
        await editMutation.mutateAsync({ data: config })
        await logCouchbaseUpdate(config, 'Couchbase configuration updated')
        return config.configId
      }),
    )

    const fulfilled = results.filter(
      (r): r is PromiseFulfilledResult<string | undefined> => r.status === 'fulfilled',
    )
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')

    if (rejected.length === 0) {
      dispatch(updateToast(true, 'success'))
    } else if (fulfilled.length === 0) {
      dispatch(updateToast(true, 'danger'))
    } else {
      dispatch(updateToast(true, 'warning', t('messages.partial_update_failure')))
      console.error(
        'Partial failure updating Couchbase configs:',
        rejected.map((r) => r.reason),
      )
    }

    queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseCouchbaseQueryKey() })
  }

  const isLoading = loading || persistenceLoading || editMutation.isPending

  return (
    <React.Fragment>
      {persistenceType === 'couchbase' ? (
        <GluuLoader blocking={isLoading}>
          <Card style={applicationStyle.mainCard}>
            <CardBody>
              <Formik
                initialValues={Array.isArray(couchbase) ? couchbase : []}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    {formik.values.length > 0 &&
                      formik.values.map((couchbaseItem, index) => (
                        <CouchbaseItem
                          key={couchbaseItem.configId ?? index}
                          couchbase={couchbaseItem}
                          index={index}
                          formik={formik}
                        />
                      ))}
                    <FormGroup row></FormGroup>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </GluuLoader>
      ) : (
        <Card style={applicationStyle.mainCard}>
          <CardBody>
            <Alert severity="info">The current data store provider is not Couchbase.</Alert>
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  )
}

export default CouchbasePage
