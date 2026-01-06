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
import type { PersistenceInfo } from './types'

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

  const persistenceType = (persistenceData as PersistenceInfo | undefined)?.persistenceType

  const editMutation = usePutConfigDatabaseCouchbase({
    mutation: {
      onSuccess: async () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseCouchbaseQueryKey() })
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  const handleSubmit = async (values: CouchbaseConfiguration[]): Promise<void> => {
    if (values && values.length > 0) {
      try {
        for (const config of values) {
          await editMutation.mutateAsync({ data: config })
          await logCouchbaseUpdate(config, 'Couchbase configuration updated')
        }
      } catch (error) {
        console.error('Failed to update Couchbase config:', error)
      }
    }
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
                    {Array.isArray(couchbase) &&
                      couchbase.length > 0 &&
                      couchbase.map((couchbaseItem, index) => (
                        <CouchbaseItem
                          key={index}
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
