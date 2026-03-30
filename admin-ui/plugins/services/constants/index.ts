export const CACHE_PROVIDER_OPTIONS = [
  { value: 'IN_MEMORY', label: 'In_Memory' },
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
