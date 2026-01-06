import React, { useEffect, useState, useMemo, ReactElement } from 'react'
import BlockUi from '../../../../app/components/BlockUi/BlockUi'
import { Formik } from 'formik'
import { Form, FormGroup, Card, Col, CardBody, InputGroup, CustomInput } from 'Components'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import CacheInMemory from './CacheInMemory'
import CacheRedis from './CacheRedis'
import CacheNative from './CacheNative'
import CacheMemcached from './CacheMemcached'
import { useDispatch } from 'react-redux'
import { CACHE } from 'Utils/ApiResources'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import {
  useGetConfigCache,
  useGetConfigCacheInMemory,
  useGetConfigCacheMemcached,
  useGetConfigCacheNativePersistence,
  useGetConfigCacheRedis,
  usePatchConfigCache,
  usePutConfigCacheInMemory,
  usePutConfigCacheMemcached,
  usePutConfigCacheNativePersistence,
  usePutConfigCacheRedis,
  getGetConfigCacheQueryKey,
  type CacheConfiguration,
  type InMemoryConfiguration,
  type MemcachedConfiguration,
  type NativePersistenceConfiguration,
  type RedisConfiguration,
} from 'JansConfigApi'
import { useCacheAudit } from './hooks'
import type { CacheFormValues } from './types'

function CachePage(): ReactElement | null {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { logCacheUpdate } = useCacheAudit()

  const [modal, setModal] = useState(false)
  const [cacheProviderType, setCacheProviderType] = useState<string>('')

  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const cacheResourceId = useMemo(() => ADMIN_UI_RESOURCES.Cache, [])
  const cacheScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[cacheResourceId], [cacheResourceId])

  const canReadCache = useMemo(
    () => hasCedarReadPermission(cacheResourceId),
    [hasCedarReadPermission, cacheResourceId],
  )
  const canWriteCache = useMemo(
    () => hasCedarWritePermission(cacheResourceId),
    [hasCedarWritePermission, cacheResourceId],
  )

  SetTitle(t('fields.cache_configuration'))

  const { data: cacheData = {} as CacheConfiguration, isLoading: cacheLoading } = useGetConfigCache({
    query: { staleTime: 30000, enabled: canReadCache },
  })
  const { data: cacheMemoryData = {} as InMemoryConfiguration, isLoading: memoryLoading } =
    useGetConfigCacheInMemory({
      query: { staleTime: 30000, enabled: canReadCache },
    })
  const { data: cacheMemData = {} as MemcachedConfiguration, isLoading: memcachedLoading } =
    useGetConfigCacheMemcached({
      query: { staleTime: 30000, enabled: canReadCache },
    })
  const { data: cacheNativeData = {} as NativePersistenceConfiguration, isLoading: nativeLoading } =
    useGetConfigCacheNativePersistence({
      query: { staleTime: 30000, enabled: canReadCache },
    })
  const { data: cacheRedisData = {} as RedisConfiguration, isLoading: redisLoading } =
    useGetConfigCacheRedis({
      query: { staleTime: 30000, enabled: canReadCache },
    })

  const loading = cacheLoading || memoryLoading || memcachedLoading || nativeLoading || redisLoading

  const patchCacheMutation = usePatchConfigCache({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigCacheQueryKey() })
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  const putMemoryMutation = usePutConfigCacheInMemory({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  const putMemcachedMutation = usePutConfigCacheMemcached({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  const putNativeMutation = usePutConfigCacheNativePersistence({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  const putRedisMutation = usePutConfigCacheRedis({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  useEffect(() => {
    authorizeHelper(cacheScopes)
  }, [authorizeHelper, cacheScopes])

  useEffect(() => {
    if (cacheData.cacheProviderType) {
      setCacheProviderType(cacheData.cacheProviderType)
    }
  }, [cacheData])

  const INITIAL_VALUES: CacheFormValues = {
    cacheProviderType: cacheData.cacheProviderType || '',
    memCacheServers: cacheMemData.servers,
    maxOperationQueueLength: cacheMemData.maxOperationQueueLength,
    bufferSize: cacheMemData.bufferSize,
    memDefaultPutExpiration: cacheMemData.defaultPutExpiration,
    connectionFactoryType: cacheMemData.connectionFactoryType,
    memoryDefaultPutExpiration: cacheMemoryData.defaultPutExpiration,
    redisProviderType: cacheRedisData.redisProviderType,
    servers: cacheRedisData.servers,
    password: cacheRedisData.password || '',
    sentinelMasterGroupName: cacheRedisData.sentinelMasterGroupName || '',
    sslTrustStoreFilePath: cacheRedisData.sslTrustStoreFilePath || '',
    redisDefaultPutExpiration: cacheRedisData.defaultPutExpiration,
    useSSL: cacheRedisData.useSSL,
    maxIdleConnections: cacheRedisData.maxIdleConnections,
    maxTotalConnections: cacheRedisData.maxTotalConnections,
    connectionTimeout: cacheRedisData.connectionTimeout,
    soTimeout: cacheRedisData.soTimeout,
    maxRetryAttempts: cacheRedisData.maxRetryAttempts,
    nativeDefaultPutExpiration: cacheNativeData.defaultPutExpiration,
    defaultCleanupBatchSize: cacheNativeData.defaultCleanupBatchSize,
    deleteExpiredOnGetRequest: cacheNativeData.deleteExpiredOnGetRequest,
  }

  function toggle(): void {
    setModal(!modal)
  }

  function handleCancel(formik: { resetForm: () => void }): () => void {
    return () => {
      formik.resetForm()
      setCacheProviderType(cacheData.cacheProviderType || '')
    }
  }

  const isMutating =
    patchCacheMutation.isPending ||
    putMemoryMutation.isPending ||
    putMemcachedMutation.isPending ||
    putNativeMutation.isPending ||
    putRedisMutation.isPending

  if (!canReadCache) {
    return null
  }

  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading || isMutating}
        keepInView={true}
        renderChildren={true}
        message={t('messages.request_waiting_message')}
      >
        <Card style={applicationStyle.mainCard}>
          <CardBody>
            <Formik
              initialValues={INITIAL_VALUES}
              enableReinitialize
              onSubmit={async (values) => {
                if (!canWriteCache) {
                  return
                }

                try {
                  if (values.cacheProviderType === 'NATIVE_PERSISTENCE') {
                    const nativeCache: NativePersistenceConfiguration = {
                      defaultPutExpiration: values.nativeDefaultPutExpiration,
                      defaultCleanupBatchSize: values.defaultCleanupBatchSize,
                      deleteExpiredOnGetRequest: values.deleteExpiredOnGetRequest,
                    }
                    await putNativeMutation.mutateAsync({ data: nativeCache })
                  }

                  if (values.cacheProviderType === 'IN_MEMORY') {
                    const memoryCache: InMemoryConfiguration = {
                      defaultPutExpiration: values.memoryDefaultPutExpiration,
                    }
                    await putMemoryMutation.mutateAsync({ data: memoryCache })
                  }

                  if (values.cacheProviderType === 'REDIS') {
                    const redisCache: RedisConfiguration = {
                      redisProviderType: values.redisProviderType as RedisConfiguration['redisProviderType'],
                      servers: values.servers,
                      password: values.password,
                      sentinelMasterGroupName: values.sentinelMasterGroupName,
                      sslTrustStoreFilePath: values.sslTrustStoreFilePath,
                      defaultPutExpiration: values.redisDefaultPutExpiration,
                      useSSL: values.useSSL,
                      maxIdleConnections: values.maxIdleConnections,
                      maxTotalConnections: values.maxTotalConnections,
                      connectionTimeout: values.connectionTimeout,
                      soTimeout: values.soTimeout,
                      maxRetryAttempts: values.maxRetryAttempts,
                    }
                    await putRedisMutation.mutateAsync({ data: redisCache })
                  }

                  if (values.cacheProviderType === 'MEMCACHED') {
                    const memCache: MemcachedConfiguration = {
                      servers: values.memCacheServers,
                      maxOperationQueueLength: values.maxOperationQueueLength,
                      bufferSize: values.bufferSize,
                      defaultPutExpiration: values.memDefaultPutExpiration,
                      connectionFactoryType: values.connectionFactoryType as MemcachedConfiguration['connectionFactoryType'],
                    }
                    await putMemcachedMutation.mutateAsync({ data: memCache })
                  }

                  if (cacheData.cacheProviderType !== values.cacheProviderType) {
                    const cache = [
                      {
                        op: 'replace' as const,
                        path: '/cacheProviderType',
                        value: values.cacheProviderType,
                      },
                    ]
                    await patchCacheMutation.mutateAsync({ data: cache })
                  }

                  await logCacheUpdate(
                    { cacheProviderType: values.cacheProviderType as CacheConfiguration['cacheProviderType'] },
                    'Cache configuration updated',
                  )
                } catch (error) {
                  console.error('Failed to update cache config:', error)
                }
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <GluuLabel label="fields.cache_provider_type" size={4} />
                    <Col sm={8}>
                      {cacheData.cacheProviderType && (
                        <GluuTooltip doc_category={CACHE} doc_entry="cacheProviderType">
                          <InputGroup>
                            <CustomInput
                              type="select"
                              id="cacheProviderType"
                              name="cacheProviderType"
                              value={cacheProviderType}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setCacheProviderType(e.target.value)
                                formik.setFieldValue('cacheProviderType', e.target.value)
                              }}
                            >
                              <option value="IN_MEMORY">{t('options.in_memory')}</option>
                              <option value="MEMCACHED">{t('options.memcached')}</option>
                              <option value="REDIS">{t('options.redis')}</option>
                              <option value="NATIVE_PERSISTENCE">
                                {t('options.native_persistence')}
                              </option>
                            </CustomInput>
                          </InputGroup>
                        </GluuTooltip>
                      )}
                    </Col>
                  </FormGroup>
                  {cacheProviderType === 'MEMCACHED' && (
                    <CacheMemcached config={cacheMemData} formik={formik} />
                  )}
                  {cacheProviderType === 'IN_MEMORY' && <CacheInMemory formik={formik} />}
                  {cacheProviderType === 'REDIS' && (
                    <CacheRedis config={cacheRedisData} formik={formik} />
                  )}
                  {cacheProviderType === 'NATIVE_PERSISTENCE' && <CacheNative formik={formik} />}
                  <FormGroup row></FormGroup>
                  <GluuFormFooter
                    showBack={true}
                    showCancel={true}
                    showApply={canWriteCache}
                    onApply={toggle}
                    onCancel={handleCancel(formik)}
                    disableBack={false}
                    disableCancel={!formik.dirty}
                    disableApply={!formik.isValid || !formik.dirty || !canWriteCache}
                    applyButtonType="button"
                    isLoading={loading || isMutating}
                  />
                  <GluuCommitDialog
                    handler={toggle}
                    modal={modal}
                    onAccept={() => {
                      toggle()
                      formik.handleSubmit()
                    }}
                    formik={formik}
                  />
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </BlockUi>
    </React.Fragment>
  )
}

export default CachePage
