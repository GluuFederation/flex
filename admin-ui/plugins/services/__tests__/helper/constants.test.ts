import {
  CACHE_PROVIDER_OPTIONS,
  REDIS_PROVIDER_OPTIONS,
  CONNECTION_FACTORY_OPTIONS,
} from 'Plugins/services/helper/constants'

describe('CACHE_PROVIDER_OPTIONS', () => {
  it('has exactly 4 options', () => {
    expect(CACHE_PROVIDER_OPTIONS).toHaveLength(4)
  })

  it('contains IN_MEMORY option', () => {
    expect(CACHE_PROVIDER_OPTIONS).toContainEqual({ value: 'IN_MEMORY', label: 'In_Memory' })
  })

  it('contains MEMCACHED option', () => {
    expect(CACHE_PROVIDER_OPTIONS).toContainEqual({ value: 'MEMCACHED', label: 'Memcached' })
  })

  it('contains REDIS option', () => {
    expect(CACHE_PROVIDER_OPTIONS).toContainEqual({ value: 'REDIS', label: 'Redis' })
  })

  it('contains NATIVE_PERSISTENCE option', () => {
    expect(CACHE_PROVIDER_OPTIONS).toContainEqual({
      value: 'NATIVE_PERSISTENCE',
      label: 'Native Persistence',
    })
  })
})

describe('REDIS_PROVIDER_OPTIONS', () => {
  it('has exactly 4 options', () => {
    expect(REDIS_PROVIDER_OPTIONS).toHaveLength(4)
  })

  it('contains STANDALONE option', () => {
    expect(REDIS_PROVIDER_OPTIONS).toContainEqual({ value: 'STANDALONE', label: 'Standalone' })
  })

  it('contains CLUSTER option', () => {
    expect(REDIS_PROVIDER_OPTIONS).toContainEqual({ value: 'CLUSTER', label: 'Cluster' })
  })

  it('contains SHARDED option', () => {
    expect(REDIS_PROVIDER_OPTIONS).toContainEqual({ value: 'SHARDED', label: 'Sharded' })
  })

  it('contains SENTINEL option', () => {
    expect(REDIS_PROVIDER_OPTIONS).toContainEqual({ value: 'SENTINEL', label: 'Sentinel' })
  })
})

describe('CONNECTION_FACTORY_OPTIONS', () => {
  it('has exactly 2 options', () => {
    expect(CONNECTION_FACTORY_OPTIONS).toHaveLength(2)
  })

  it('contains DEFAULT option', () => {
    expect(CONNECTION_FACTORY_OPTIONS).toContainEqual({ value: 'DEFAULT', label: 'Default' })
  })

  it('contains BINARY option', () => {
    expect(CONNECTION_FACTORY_OPTIONS).toContainEqual({ value: 'BINARY', label: 'Binary' })
  })
})
