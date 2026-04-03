import type { CacheFormValues } from '../Components/types'

type CacheFieldLabel = { key: keyof CacheFormValues; label: string }

const COMMON_FIELDS: CacheFieldLabel[] = [
  { key: 'cacheProviderType', label: 'fields.cache_provider_type' },
]

const IN_MEMORY_FIELDS: CacheFieldLabel[] = [
  { key: 'memoryDefaultPutExpiration', label: 'fields.default_put_expiration' },
]

const MEMCACHED_FIELDS: CacheFieldLabel[] = [
  { key: 'memCacheServers', label: 'fields.servers' },
  { key: 'maxOperationQueueLength', label: 'fields.max_operation_queue_length' },
  { key: 'bufferSize', label: 'fields.buffer_size' },
  { key: 'memDefaultPutExpiration', label: 'fields.default_put_expiration' },
  { key: 'connectionFactoryType', label: 'fields.connection_factory_type' },
]

const REDIS_FIELDS: CacheFieldLabel[] = [
  { key: 'redisProviderType', label: 'fields.redis_provider_type' },
  { key: 'servers', label: 'fields.servers' },
  { key: 'sentinelMasterGroupName', label: 'fields.sentinel_master_group_name' },
  { key: 'sslTrustStoreFilePath', label: 'fields.ssl_trust_store_file_path' },
  { key: 'redisDefaultPutExpiration', label: 'fields.default_put_expiration' },
  { key: 'useSSL', label: 'fields.use_ssl' },
  { key: 'maxIdleConnections', label: 'fields.max_idle_connections' },
  { key: 'maxTotalConnections', label: 'fields.max_total_connections' },
  { key: 'connectionTimeout', label: 'fields.connection_timeout' },
  { key: 'soTimeout', label: 'fields.so_timeout' },
  { key: 'maxRetryAttempts', label: 'fields.max_retry_attempts' },
]

const NATIVE_PERSISTENCE_FIELDS: CacheFieldLabel[] = [
  { key: 'nativeDefaultPutExpiration', label: 'fields.default_put_expiration' },
  { key: 'defaultCleanupBatchSize', label: 'fields.default_cleanup_batch_size' },
  { key: 'deleteExpiredOnGetRequest', label: 'fields.delete_expired_on_get_request' },
]

export const CACHE_FIELD_LABELS_BY_PROVIDER: Record<string, CacheFieldLabel[]> = {
  IN_MEMORY: [...COMMON_FIELDS, ...IN_MEMORY_FIELDS],
  MEMCACHED: [...COMMON_FIELDS, ...MEMCACHED_FIELDS],
  REDIS: [...COMMON_FIELDS, ...REDIS_FIELDS],
  NATIVE_PERSISTENCE: [...COMMON_FIELDS, ...NATIVE_PERSISTENCE_FIELDS],
}

export const servicesConstants = {
  DOC_CATEGORY: 'cache',
} as const

export const CACHE_PROVIDER_OPTIONS = [
  { value: 'IN_MEMORY', label: 'In Memory' },
  { value: 'MEMCACHED', label: 'Memcached' },
  { value: 'REDIS', label: 'Redis' },
  { value: 'NATIVE_PERSISTENCE', label: 'Native Persistence' },
]

export const REDIS_PROVIDER_OPTIONS = [
  { value: 'STANDALONE', label: 'Standalone' },
  { value: 'CLUSTER', label: 'Cluster' },
  { value: 'SHARDED', label: 'Sharded' },
  { value: 'SENTINEL', label: 'Sentinel' },
]

export const CONNECTION_FACTORY_OPTIONS = [
  { value: 'DEFAULT', label: 'Default' },
  { value: 'BINARY', label: 'Binary' },
]
