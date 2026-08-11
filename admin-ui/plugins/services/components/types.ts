import type { CacheConfigurationCacheProviderType, RedisConfiguration } from 'JansConfigApi'
import type { FormikProps } from 'formik'

export type CacheProviderType = CacheConfigurationCacheProviderType
export type RedisConfigurationPayload = RedisConfiguration & {
  username?: string
}

export type InMemoryCacheFormValues = {
  cacheProviderType: 'IN_MEMORY'
  memoryDefaultPutExpiration?: number
}

export type MemcachedCacheFormValues = {
  cacheProviderType: 'MEMCACHED'
  memCacheServers?: string
  maxOperationQueueLength?: number
  bufferSize?: number
  memDefaultPutExpiration?: number
  connectionFactoryType?: string
}

export type RedisCacheFormValues = {
  cacheProviderType: 'REDIS'
  redisProviderType?: string
  servers?: string
  username?: string
  password?: string
  sentinelMasterGroupName?: string
  sslTrustStoreFilePath?: string
  sslTrustStorePassword?: string
  sslKeyStoreFilePath?: string
  sslKeyStorePassword?: string
  redisDefaultPutExpiration?: number
  useSSL?: boolean
  maxIdleConnections?: number
  maxTotalConnections?: number
  connectionTimeout?: number
  soTimeout?: number
  maxRetryAttempts?: number
}

export type NativePersistenceCacheFormValues = {
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

export type CacheFormValues = {
  cacheProviderType: CacheProviderType
  memoryDefaultPutExpiration?: number
  memCacheServers?: string
  maxOperationQueueLength?: number
  bufferSize?: number
  memDefaultPutExpiration?: number
  connectionFactoryType?: string
  redisProviderType?: string
  servers?: string
  username?: string
  password?: string
  sentinelMasterGroupName?: string
  sslTrustStoreFilePath?: string
  sslTrustStorePassword?: string
  sslKeyStoreFilePath?: string
  sslKeyStorePassword?: string
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

export type CacheSubComponentBaseProps = {
  formik: FormikProps<CacheFormValues>
  classes: Record<string, string>
  isDark: boolean
  disabled?: boolean
}

export type CacheMemcachedProps = CacheSubComponentBaseProps

export type CacheRedisProps = CacheSubComponentBaseProps
