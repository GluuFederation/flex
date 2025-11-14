import React, { useEffect, useState, useMemo } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import {
  getCacheConfig,
  getMemoryCacheConfig,
  getMemCacheConfig,
  getNativeCacheConfig,
  getRedisCacheConfig,
  editCache,
  editMemoryCache,
  editNativeCache,
  editRedisCache,
  editMemCache,
} from 'Plugins/services/redux/features/cacheSlice'
import { CACHE } from 'Utils/ApiResources'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

function CachePage() {
  const cacheData = useSelector((state) => state.cacheReducer.cache)
  const cacheMemoryData = useSelector((state) => state.cacheReducer.cacheMemory)
  const cacheMemData = useSelector((state) => state.cacheReducer.cacheMem)
  const cacheNativeData = useSelector((state) => state.cacheReducer.cacheNative)
  const cacheRedisData = useSelector((state) => state.cacheReducer.cacheRedis)
  const loading = useSelector((state) => state.cacheReducer.loading)

  const dispatch = useDispatch()

  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const [cacheProviderType, setCacheProviderType] = useState(cacheData.cacheProviderType)
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const cacheResourceId = useMemo(() => ADMIN_UI_RESOURCES.Cache, [])
  const cacheScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[cacheResourceId], [cacheResourceId])
  const canReadCache = useMemo(
    () => hasCedarReadPermission(cacheResourceId) === true,
    [hasCedarReadPermission, cacheResourceId],
  )
  const canWriteCache = useMemo(
    () => hasCedarWritePermission(cacheResourceId) === true,
    [hasCedarWritePermission, cacheResourceId],
  )

  SetTitle(t('fields.cache_configuration'))

  useEffect(() => {
    authorizeHelper(cacheScopes)
  }, [authorizeHelper, cacheScopes])

  useEffect(() => {
    if (canReadCache) {
      dispatch(getCacheConfig())
      dispatch(getMemoryCacheConfig())
      dispatch(getMemCacheConfig())
      dispatch(getNativeCacheConfig())
      dispatch(getRedisCacheConfig())
    }
  }, [canReadCache, dispatch])

  useEffect(() => {
    setCacheProviderType(cacheData.cacheProviderType)
  }, [cacheData])

  const INITIAL_VALUES = {
    cacheProviderType: cacheData.cacheProviderType,
    memCacheServers: cacheMemData.servers,
    maxOperationQueueLength: cacheMemData.maxOperationQueueLength,
    bufferSize: cacheMemData.bufferSize,
    memDefaultPutExpiration: cacheMemData.defaultPutExpiration,
    connectionFactoryType: cacheMemData.connectionFactoryType,
    memoryDefaultPutExpiration: cacheMemoryData.defaultPutExpiration,
    redisProviderType: cacheRedisData.redisProviderType,
    servers: cacheRedisData.servers,
    password: cacheRedisData.password ? cacheRedisData.password : '',
    sentinelMasterGroupName: cacheRedisData.sentinelMasterGroupName
      ? cacheRedisData.sentinelMasterGroupName
      : '',
    sslTrustStoreFilePath: cacheRedisData.sslTrustStoreFilePath
      ? cacheRedisData.sslTrustStoreFilePath
      : '',
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

  function toggle() {
    setModal(!modal)
  }
  function handleCancel(formik) {
    return () => {
      formik.resetForm()
      setCacheProviderType(cacheData.cacheProviderType)
    }
  }

  if (!canReadCache) {
    return null
  }

  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        keepInView={true}
        renderChildren={true}
        message={t('messages.request_waiting_message')}
      >
        <Card style={applicationStyle.mainCard}>
          <CardBody>
            <Formik
              initialValues={INITIAL_VALUES}
              enableReinitialize
              onSubmit={(values) => {
                if (!canWriteCache) {
                  return
                }
                const cache = [
                  {
                    op: 'replace',
                    path: '/cacheProviderType',
                    value: values.cacheProviderType,
                  },
                ]
                const nativeCache = {
                  defaultPutExpiration: values.nativeDefaultPutExpiration,
                  defaultCleanupBatchSize: values.defaultCleanupBatchSize,
                  deleteExpiredOnGetRequest: values.deleteExpiredOnGetRequest,
                }
                const memoryCache = {
                  defaultPutExpiration: values.memoryDefaultPutExpiration,
                }
                const redisCache = {
                  redisProviderType: values.redisProviderType,
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

                const memCache = {
                  servers: values.memCacheServers,
                  maxOperationQueueLength: values.maxOperationQueueLength,
                  bufferSize: values.bufferSize,
                  defaultPutExpiration: values.memDefaultPutExpiration,
                  connectionFactoryType: values.connectionFactoryType,
                }
                if (values.cacheProviderType === 'NATIVE_PERSISTENCE') {
                  const opts1 = {}
                  opts1['nativePersistenceConfiguration'] = JSON.stringify(nativeCache)
                  dispatch(editNativeCache({ data: opts1 }))
                }

                if (values.cacheProviderType === 'IN_MEMORY') {
                  const opts2 = {}
                  opts2['inMemoryConfiguration'] = JSON.stringify(memoryCache)
                  dispatch(editMemoryCache({ data: opts2 }))
                }

                if (values.cacheProviderType === 'REDIS') {
                  const opts3 = {}
                  opts3['redisConfiguration'] = JSON.stringify(redisCache)
                  dispatch(editRedisCache({ data: opts3 }))
                }

                if (values.cacheProviderType === 'MEMCACHED') {
                  const opts4 = {}
                  opts4['memcachedConfiguration'] = JSON.stringify(memCache)
                  dispatch(editMemCache({ data: opts4 }))
                }

                if (cacheData.cacheProviderType !== values.cacheProviderType) {
                  const opts5 = {}
                  opts5['requestBody'] = JSON.stringify(cache)
                  dispatch(editCache({ data: opts5 }))
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
                              onChange={(e) => {
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
                  {cacheProviderType == 'MEMCACHED' && (
                    <CacheMemcached config={cacheMemData} formik={formik} />
                  )}
                  {cacheProviderType == 'IN_MEMORY' && (
                    <CacheInMemory config={cacheMemoryData} formik={formik} />
                  )}
                  {cacheProviderType == 'REDIS' && (
                    <CacheRedis config={cacheRedisData} formik={formik} />
                  )}
                  {cacheProviderType == 'NATIVE_PERSISTENCE' && (
                    <CacheNative config={cacheNativeData} formik={formik} />
                  )}
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
                    isLoading={loading}
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
