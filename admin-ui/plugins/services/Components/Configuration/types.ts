import type {
  GluuLdapConfiguration,
  SqlConfiguration,
  CouchbaseConfiguration,
  MemcachedConfiguration,
  RedisConfiguration,
} from 'JansConfigApi'
import type { FormikProps } from 'formik'

export interface LdapFormProps {
  item: GluuLdapConfiguration
  handleSubmit: (data: { ldap: GluuLdapConfiguration } | GluuLdapConfiguration) => void
  createLdap?: boolean
  isLoading?: boolean
}

export interface LdapDetailPageProps {
  row: GluuLdapConfiguration
  testLdapConnection: (row: GluuLdapConfiguration) => void
}

export interface SqlFormProps {
  item: SqlConfiguration
  handleSubmit: (data: { sql: SqlConfiguration }) => void
  isLoading?: boolean
}

export interface SqlDetailPageProps {
  row: SqlConfiguration
  testSqlConnection?: (row: SqlConfiguration) => void
}

export type CacheProviderType = 'IN_MEMORY' | 'MEMCACHED' | 'REDIS' | 'NATIVE_PERSISTENCE'

export interface InMemoryCacheFormValues {
  cacheProviderType: 'IN_MEMORY'
  memoryDefaultPutExpiration?: number
}

export interface MemcachedCacheFormValues {
  cacheProviderType: 'MEMCACHED'
  memCacheServers?: string
  maxOperationQueueLength?: number
  bufferSize?: number
  memDefaultPutExpiration?: number
  connectionFactoryType?: string
}

export interface RedisCacheFormValues {
  cacheProviderType: 'REDIS'
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
}

export interface NativePersistenceCacheFormValues {
  cacheProviderType: 'NATIVE_PERSISTENCE'
  nativeDefaultPutExpiration?: number
  defaultCleanupBatchSize?: number
  deleteExpiredOnGetRequest?: boolean
}

export type CacheFormValuesUnion =
  | InMemoryCacheFormValues
  | MemcachedCacheFormValues
  | RedisCacheFormValues
  | NativePersistenceCacheFormValues

export interface CacheFormValues {
  cacheProviderType: CacheProviderType
  memoryDefaultPutExpiration?: number
  memCacheServers?: string
  maxOperationQueueLength?: number
  bufferSize?: number
  memDefaultPutExpiration?: number
  connectionFactoryType?: string
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

export function isInMemoryCache(
  values: CacheFormValues | CacheFormValuesUnion,
): values is InMemoryCacheFormValues {
  return values.cacheProviderType === 'IN_MEMORY'
}

export function isMemcachedCache(
  values: CacheFormValues | CacheFormValuesUnion,
): values is MemcachedCacheFormValues {
  return values.cacheProviderType === 'MEMCACHED'
}

export function isRedisCache(
  values: CacheFormValues | CacheFormValuesUnion,
): values is RedisCacheFormValues {
  return values.cacheProviderType === 'REDIS'
}

export function isNativePersistenceCache(
  values: CacheFormValues | CacheFormValuesUnion,
): values is NativePersistenceCacheFormValues {
  return values.cacheProviderType === 'NATIVE_PERSISTENCE'
}

export interface CacheInMemoryProps {
  formik: FormikProps<CacheFormValues>
}

export interface CacheMemcachedProps {
  config: MemcachedConfiguration
  formik: FormikProps<CacheFormValues>
}

export interface CacheNativeProps {
  formik: FormikProps<CacheFormValues>
}

export interface CacheRedisProps {
  config: RedisConfiguration
  formik: FormikProps<CacheFormValues>
}

export interface CouchbaseItemProps {
  couchbase: CouchbaseConfiguration
  index: number
  formik: FormikProps<CouchbaseConfiguration[]>
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

export function isPersistenceInfo(data: unknown): data is PersistenceInfo {
  return (
    data !== null && typeof data === 'object' && !Array.isArray(data) && 'persistenceType' in data
  )
}

export function extractActionMessage<T extends { action_message?: string }>(
  data: T,
  defaultMessage: string,
): { cleanData: Omit<T, 'action_message'>; message: string } {
  const { action_message, ...cleanData } = data
  return {
    cleanData: cleanData as Omit<T, 'action_message'>,
    message: action_message || defaultMessage,
  }
}
