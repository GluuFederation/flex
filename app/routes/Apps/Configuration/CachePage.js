import React from 'react'
import {
  Form,
  FormGroup,
  Container,
  Card,
  Col,
  Input,
  CardBody,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import GluuLabel from '../Gluu/GluuLabel'
import CacheInMemory from './CacheInMemory'
import CacheRedis from './CacheRedis'
import CacheNative from './CacheNative'
import CacheMemcached from './CacheMemcached'
function CachePage() {
  const cache = {
    cacheProviderType: 'NATIVE_PERSISTENCE',
    memcachedConfiguration: {
      servers: 'localhost:11211',
      maxOperationQueueLength: 100000,
      bufferSize: 32768,
      defaultPutExpiration: 60,
      connectionFactoryType: 'DEFAULT',
    },
    inMemoryConfiguration: { defaultPutExpiration: 60 },
    redisConfiguration: {
      redisProviderType: 'STANDALONE',
      servers: 'localhost:6379',
      defaultPutExpiration: 60,
      useSSL: false,
      maxIdleConnections: 10,
      maxTotalConnections: 500,
      connectionTimeout: 3000,
      soTimeout: 3000,
      maxRetryAttempts: 5,
    },
    nativePersistenceConfiguration: {
      defaultPutExpiration: 60,
      defaultCleanupBatchSize: 10000,
      deleteExpiredOnGetRequest: false,
    },
  }
  return (
    <React.Fragment>
      <Container>
        <Card>
          <CardBody>
            <Form>
              <FormGroup row>
                <GluuLabel label="Cache Provider Type" size={4} />
                <Col sm={8}>
                  <Input
                    id="cacheProviderType"
                    name="cacheProviderType"
                    defaultValue={cache.cacheProviderType}
                    disabled
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <CacheRedis config={cache.redisConfiguration} />
              </FormGroup>
              <FormGroup row>
                <CacheNative config={cache.nativePersistenceConfiguration} />
              </FormGroup>
              <FormGroup row>
                <CacheMemcached config={cache.memcachedConfiguration} />
              </FormGroup>
              <FormGroup row>
                <CacheInMemory config={cache.inMemoryConfiguration} />
              </FormGroup>
              <FormGroup row></FormGroup>
              <GluuFooter />
            </Form>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default CachePage
