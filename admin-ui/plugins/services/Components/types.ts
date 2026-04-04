import type { FormikProps } from 'formik'

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

export interface CacheSubComponentBaseProps {
  formik: FormikProps<CacheFormValues>
  classes: Record<string, string>
  isDark: boolean
  disabled?: boolean
}

export type CacheMemcachedProps = CacheSubComponentBaseProps

export type CacheRedisProps = CacheSubComponentBaseProps

export interface PersistenceInfo {
  persistenceType?: string
  databaseName?: string
  schemaName?: string
  productName?: string
  productVersion?: string
  driverName?: string
  driverVersion?: string
}
