import React, { useEffect, useState } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  Form,
  FormGroup,
  Card,
  Col,
  CardBody,
  InputGroup,
  CustomInput,
} from 'Components'
import GluuFooter from 'Routes/Apps/Gluu/GluuFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import CacheInMemory from './CacheInMemory'
import CacheRedis from './CacheRedis'
import CacheNative from './CacheNative'
import CacheMemcached from './CacheMemcached'
import { connect } from 'react-redux'
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
} from 'Plugins/services/redux/actions/CacheActions'
import { CACHE } from 'Utils/ApiResources'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import useAlert from 'Context/alert/useAlert'

function CachePage({
  cacheData,
  cacheMemoryData,
  cacheMemData,
  cacheNativeData,
  cacheRedisData,
  loading,
  dispatch,
  isSuccess,
  isError,
}) {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const [cacheProviderType, setCacheProviderType] = useState(
    cacheData.cacheProviderType,
  )
  const { setAlert } = useAlert()

  const alertSeverity = isSuccess ? 'success' : 'error'
  const alertMessage = isSuccess ? t('messages.success_in_saving') : t('messages.error_in_saving')
  SetTitle(t('fields.cache_configuration'))

  useEffect(() => {
    dispatch(getCacheConfig())
    dispatch(getMemoryCacheConfig())
    dispatch(getMemCacheConfig())
    dispatch(getNativeCacheConfig())
    dispatch(getRedisCacheConfig())
  }, [])

  useEffect(() => {
    setCacheProviderType(cacheData.cacheProviderType)
  }, [cacheData])

  useEffect(() => {
    const alertParam = { 
      open: (isSuccess || isError),
      title: isSuccess ? 'Success' : 'Failed',
      text: alertMessage,
      severity: alertSeverity
    }
    setAlert(alertParam)
  }, [isSuccess, isError])

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
  function submitForm() {
    toggle()
    document.getElementsByClassName('LdapUserActionSubmitButton')[0].click()
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

                const opts1 = {}
                opts1['nativePersistenceConfiguration'] = JSON.stringify(
                  nativeCache,
                )
                dispatch(editNativeCache(opts1))

                const opts2 = {}
                opts2['inMemoryConfiguration'] = JSON.stringify(memoryCache)
                dispatch(editMemoryCache(opts2))

                const opts3 = {}
                opts3['redisConfiguration'] = JSON.stringify(redisCache)
                dispatch(editRedisCache(opts3))

                const opts4 = {}
                opts4['memcachedConfiguration'] = JSON.stringify(memCache)
                dispatch(editMemCache(opts4))

                const opts5 = {}
                opts5['patchRequest'] = JSON.stringify(cache)
                dispatch(editCache(opts5))
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <GluuLabel label="fields.cache_provider_type" size={4} />
                    <Col sm={8}>
                      {cacheData.cacheProviderType && (
                        <GluuTooltip
                          doc_category={CACHE}
                          doc_entry="cacheProviderType"
                        >
                          <InputGroup>
                            <CustomInput
                              type="select"
                              id="cacheProviderType"
                              name="cacheProviderType"
                              defaultValue={cacheData.cacheProviderType}
                              onChange={(e) => {
                                setCacheProviderType(e.target.value)
                                formik.setFieldValue(
                                  'cacheProviderType',
                                  e.target.value,
                                )
                              }}
                            >
                              <option value="IN_MEMORY">
                                {t('options.in_memory')}
                              </option>
                              <option value="MEMCACHED">
                                {t('options.memcached')}
                              </option>
                              <option value="REDIS">
                                {t('options.redis')}
                              </option>
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
                  <GluuFooter saveHandler={toggle} />
                  <GluuCommitDialog
                    handler={toggle}
                    modal={modal}
                    onAccept={submitForm}
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

const mapStateToProps = (state) => {
  return {
    cacheData: state.cacheReducer.cache,
    cacheMemoryData: state.cacheReducer.cacheMemory,
    cacheMemData: state.cacheReducer.cacheMem,
    cacheNativeData: state.cacheReducer.cacheNative,
    cacheRedisData: state.cacheReducer.cacheRedis,
    isSuccess: state.cacheReducer.isSuccess,
    isError: state.cacheReducer.isError,
    permissions: state.authReducer.permissions,
    loading: state.cacheReducer.loading,
  }
}

export default connect(mapStateToProps)(CachePage)
