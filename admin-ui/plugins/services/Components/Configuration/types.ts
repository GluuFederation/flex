import type {
  GluuLdapConfiguration,
  SqlConfiguration,
  CouchbaseConfiguration,
  CacheConfiguration,
  InMemoryConfiguration,
  MemcachedConfiguration,
  NativePersistenceConfiguration,
  RedisConfiguration,
} from 'JansConfigApi'
import type { FormikProps } from 'formik'

export interface LdapFormProps {
  item: GluuLdapConfiguration
  handleSubmit: (data: { ldap: GluuLdapConfiguration } | GluuLdapConfiguration) => void
  createLdap?: boolean
}

export interface LdapDetailPageProps {
  row: GluuLdapConfiguration
  testLdapConnection: (row: GluuLdapConfiguration) => void
}

export interface SqlFormProps {
  item: SqlConfiguration
  handleSubmit: (data: { sql: SqlConfiguration } | SqlConfiguration) => void
  createSql?: boolean
}

export interface SqlDetailPageProps {
  row: SqlConfiguration
  testSqlConnection: (row: SqlConfiguration) => void
}

export interface CacheInMemoryProps {
  config: InMemoryConfiguration
  formik: FormikProps<CacheFormValues>
}

export interface CacheMemcachedProps {
  config: MemcachedConfiguration
  formik: FormikProps<CacheFormValues>
}

export interface CacheNativeProps {
  config: NativePersistenceConfiguration
  formik: FormikProps<CacheFormValues>
}

export interface CacheRedisProps {
  config: RedisConfiguration
  formik: FormikProps<CacheFormValues>
}

export interface CacheFormValues {
  cacheProviderType: string
  memCacheServers?: string
  maxOperationQueueLength?: number
  bufferSize?: number
  memDefaultPutExpiration?: number
  connectionFactoryType?: string
  memoryDefaultPutExpiration?: number
  redisProviderType?: string
  servers?: string
  password?: string
  sentinelMasterGroupName?: string
  sslTrustStoreFilePath?: string
  redisDefaultPutExpiration?: number
  useSSL?: boolean
  maxIdleConnections?: number
  maxTotalConnections?: number
  connectionTimeout?: number
  soTimeout?: number
  maxRetryAttempts?: number
  nativeDefaultPutExpiration?: number
  defaultCleanupBatchSize?: number
  deleteExpiredOnGetRequest?: boolean
}

export interface CouchbaseItemProps {
  couchbase: CouchbaseConfiguration
  formik: FormikProps<CouchbaseFormValues>
}

export interface CouchbaseFormValues {
  configId?: string
  userName?: string
  userPassword?: string
  servers?: string[]
  defaultBucket?: string
  buckets?: string[]
  passwordEncryptionMethod?: string
  connectTimeout?: number
  computationPoolSize?: number
  useSSL?: boolean
  sslTrustStoreFile?: string
  sslTrustStorePin?: string
  sslTrustStoreFormat?: string
  enabled?: boolean
  binaryAttributes?: string[]
  certificateAttributes?: string[]
}

export interface PersistenceInfo {
  persistenceType?: string
  databaseName?: string
  schemaName?: string
  productName?: string
  productVersion?: string
  driverName?: string
  driverVersion?: string
}
