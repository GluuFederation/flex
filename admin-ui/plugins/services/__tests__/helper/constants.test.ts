import {
  getCacheProviderOptions,
  getRedisProviderOptions,
  getConnectionFactoryOptions,
} from 'Plugins/services/helper/constants'

describe('getCacheProviderOptions', () => {
  it('has exactly 4 options', () => {
    expect(getCacheProviderOptions()).toHaveLength(4)
  })

  it('contains IN_MEMORY option', () => {
    expect(getCacheProviderOptions()).toContainEqual({ value: 'IN_MEMORY', label: 'In Memory' })
  })

  it('contains MEMCACHED option', () => {
    expect(getCacheProviderOptions()).toContainEqual({ value: 'MEMCACHED', label: 'Memcached' })
  })

  it('contains REDIS option', () => {
    expect(getCacheProviderOptions()).toContainEqual({ value: 'REDIS', label: 'Redis' })
  })

  it('contains NATIVE_PERSISTENCE option', () => {
    expect(getCacheProviderOptions()).toContainEqual({
      value: 'NATIVE_PERSISTENCE',
      label: 'Native Persistence',
    })
  })
})

describe('getRedisProviderOptions', () => {
  it('has exactly 4 options', () => {
    expect(getRedisProviderOptions()).toHaveLength(4)
  })

  it('contains STANDALONE option', () => {
    expect(getRedisProviderOptions()).toContainEqual({ value: 'STANDALONE', label: 'Standalone' })
  })

  it('contains CLUSTER option', () => {
    expect(getRedisProviderOptions()).toContainEqual({ value: 'CLUSTER', label: 'Cluster' })
  })

  it('contains SHARDED option', () => {
    expect(getRedisProviderOptions()).toContainEqual({ value: 'SHARDED', label: 'Sharded' })
  })

  it('contains SENTINEL option', () => {
    expect(getRedisProviderOptions()).toContainEqual({ value: 'SENTINEL', label: 'Sentinel' })
  })
})

describe('getConnectionFactoryOptions', () => {
  it('has exactly 2 options', () => {
    expect(getConnectionFactoryOptions()).toHaveLength(2)
  })

  it('contains DEFAULT option', () => {
    expect(getConnectionFactoryOptions()).toContainEqual({ value: 'DEFAULT', label: 'Default' })
  })

  it('contains BINARY option', () => {
    expect(getConnectionFactoryOptions()).toContainEqual({ value: 'BINARY', label: 'Binary' })
  })
})
