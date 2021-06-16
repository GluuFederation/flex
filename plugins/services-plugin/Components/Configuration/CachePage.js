import React, { useEffect, useState } from 'react'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import {
  Form,
  FormGroup,
  Container,
  Card,
  Col,
  Input,
  CardBody,
  InputGroup,
  CustomInput,
} from '../../../../app/components'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import CacheInMemory from './CacheInMemory'
import CacheRedis from './CacheRedis'
import CacheNative from './CacheNative'
import CacheMemcached from './CacheMemcached'
import { connect } from 'react-redux'
import {
  getCacheConfig, getMemoryCacheConfig, getMemCacheConfig, getNativeCacheConfig, getRedisCacheConfig,
  editCache, editMemoryCache, editNativeCache, editRedisCache, editMemCache
} from '../../redux/actions/CacheActions'

import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'

function CachePage({ cacheData, cacheMemoryData, cacheMemData, cacheNativeData, cacheRedisData, loading, dispatch }) {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const [cacheProviderType, setCacheProviderType] = useState(cacheData.cacheProviderType)

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
    password: cacheRedisData.password ? cacheRedisData.password : "",
    sentinelMasterGroupName: cacheRedisData.sentinelMasterGroupName ? cacheRedisData.sentinelMasterGroupName : "",
    sslTrustStoreFilePath: cacheRedisData.sslTrustStoreFilePath ? cacheRedisData.sslTrustStoreFilePath : "",
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
      <Container>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={t("Performing the request, please wait!")}
        >
          <Card>
            <CardBody>
              <Formik
                initialValues={INITIAL_VALUES}
                enableReinitialize
                onSubmit={(values) => {
                  const cache= [
                    {
                      "op": "replace",
                      "path": "/cacheProviderType",
                      "value": values.cacheProviderType
                    }
                  ]
                  const nativeCache = {
                    "defaultPutExpiration": values.nativeDefaultPutExpiration,
                    "defaultCleanupBatchSize": values.defaultCleanupBatchSize,
                    "deleteExpiredOnGetRequest": values.deleteExpiredOnGetRequest,
                  }
                  const memoryCache = {
                    "defaultPutExpiration": values.memoryDefaultPutExpiration,
                  }
                  const redisCache = {
                    "redisProviderType": values.redisProviderType,
                    "servers": values.servers,
                    "password": values.password,
                    "sentinelMasterGroupName": values.sentinelMasterGroupName,
                    "sslTrustStoreFilePath": values.sslTrustStoreFilePath,
                    "defaultPutExpiration": values.redisDefaultPutExpiration,
                    "useSSL": values.useSSL,
                    "maxIdleConnections": values.maxIdleConnections,
                    "maxTotalConnections": values.maxTotalConnections,
                    "connectionTimeout": values.connectionTimeout,
                    "soTimeout": values.soTimeout,
                    "maxRetryAttempts": values.maxRetryAttempts,
                  }

                  const memCache = {
                    "servers": values.memCacheServers,
                    "maxOperationQueueLength": values.maxOperationQueueLength,
                    "bufferSize": values.bufferSize,
                    "defaultPutExpiration": values.memDefaultPutExpiration,
                    "connectionFactoryType": values.connectionFactoryType,
                  }

                  const opts1 = {}
                  opts1['nativePersistenceConfiguration'] = JSON.stringify(nativeCache)
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
                      <Col xs="12" style={{fontSize: 24, fontWeight: 'bold', marginBottom: 15}}>Cache Configuration</Col>
                      <GluuLabel label={t("Cache Provider Type")} size={4} />
                      <Col sm={8}>
                        {
                          cacheData.cacheProviderType && (
                            <InputGroup>
                              <CustomInput
                                type="select"
                                id="cacheProviderType"
                                name="cacheProviderType"
                                defaultValue={cacheData.cacheProviderType}
                                onChange={formik.handleChange}
                                onChange={(e) => {
                                  setCacheProviderType(e.target.value)
                                  formik.setFieldValue('cacheProviderType', e.target.value)
                                }}
                              >
                                <option>{t("IN_MEMORY")}</option>
                                <option>{t("MEMCACHED")}</option>
                                <option>{t("REDIS")}</option>
                                <option>{t("NATIVE_PERSISTENCE")}</option>
                              </CustomInput>
                            </InputGroup>
                          )
                        }
                      </Col>
                    </FormGroup>
                    {cacheProviderType == 'MEMCACHED' && (<FormGroup row>
                      <CacheMemcached config={cacheMemData} formik={formik} />
                    </FormGroup>)}
                    {cacheProviderType == 'IN_MEMORY' && (<FormGroup row>
                      <CacheInMemory config={cacheMemoryData} formik={formik} />
                    </FormGroup>)}
                    {cacheProviderType == 'REDIS' && (<FormGroup row>
                      <CacheRedis config={cacheRedisData} formik={formik} />
                    </FormGroup>)}
                    {cacheProviderType == 'NATIVE_PERSISTENCE' && (<FormGroup row>
                      <CacheNative config={cacheNativeData} formik={formik} />
                    </FormGroup>)}
                    <FormGroup row></FormGroup>
                    <GluuFooter saveHandler={toggle}/>
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
      </Container>
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

    permissions: state.authReducer.permissions,
    loading: state.cacheReducer.loading,
  }
}


export default connect(mapStateToProps)(CachePage)
