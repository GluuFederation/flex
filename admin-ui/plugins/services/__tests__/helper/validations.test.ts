import {
  isInMemoryCache,
  isMemcachedCache,
  isRedisCache,
  isNativePersistenceCache,
  isPersistenceInfo,
} from 'Plugins/services/helper/utils'
import type { CacheFormValues } from 'Plugins/services/Components/types'

const baseCacheValues: CacheFormValues = {
  cacheProviderType: 'IN_MEMORY',
}

describe('isInMemoryCache', () => {
  it('returns true for IN_MEMORY provider', () => {
    expect(isInMemoryCache({ ...baseCacheValues, cacheProviderType: 'IN_MEMORY' })).toBe(true)
  })

  it('returns false for other providers', () => {
    expect(isInMemoryCache({ ...baseCacheValues, cacheProviderType: 'REDIS' })).toBe(false)
    expect(isInMemoryCache({ ...baseCacheValues, cacheProviderType: 'MEMCACHED' })).toBe(false)
    expect(isInMemoryCache({ ...baseCacheValues, cacheProviderType: 'NATIVE_PERSISTENCE' })).toBe(
      false,
    )
  })
})

describe('isMemcachedCache', () => {
  it('returns true for MEMCACHED provider', () => {
    expect(isMemcachedCache({ ...baseCacheValues, cacheProviderType: 'MEMCACHED' })).toBe(true)
  })

  it('returns false for other providers', () => {
    expect(isMemcachedCache({ ...baseCacheValues, cacheProviderType: 'IN_MEMORY' })).toBe(false)
    expect(isMemcachedCache({ ...baseCacheValues, cacheProviderType: 'REDIS' })).toBe(false)
  })
})

describe('isRedisCache', () => {
  it('returns true for REDIS provider', () => {
    expect(isRedisCache({ ...baseCacheValues, cacheProviderType: 'REDIS' })).toBe(true)
  })

  it('returns false for other providers', () => {
    expect(isRedisCache({ ...baseCacheValues, cacheProviderType: 'IN_MEMORY' })).toBe(false)
    expect(isRedisCache({ ...baseCacheValues, cacheProviderType: 'MEMCACHED' })).toBe(false)
  })
})

describe('isNativePersistenceCache', () => {
  it('returns true for NATIVE_PERSISTENCE provider', () => {
    expect(
      isNativePersistenceCache({ ...baseCacheValues, cacheProviderType: 'NATIVE_PERSISTENCE' }),
    ).toBe(true)
  })

  it('returns false for other providers', () => {
    expect(isNativePersistenceCache({ ...baseCacheValues, cacheProviderType: 'IN_MEMORY' })).toBe(
      false,
    )
    expect(isNativePersistenceCache({ ...baseCacheValues, cacheProviderType: 'REDIS' })).toBe(false)
  })
})

describe('isPersistenceInfo', () => {
  it('returns true for valid persistence info object', () => {
    expect(isPersistenceInfo({ persistenceType: 'sql' })).toBe(true)
  })

  it('returns true for full persistence info', () => {
    expect(
      isPersistenceInfo({
        persistenceType: 'sql',
        databaseName: 'jansdb',
        productName: 'PostgreSQL',
        productVersion: '14.0',
        driverName: 'pg',
        driverVersion: '42.3',
      }),
    ).toBe(true)
  })

  it('returns false for null', () => {
    expect(isPersistenceInfo(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isPersistenceInfo(undefined)).toBe(false)
  })

  it('returns false for object without persistenceType', () => {
    expect(isPersistenceInfo({ databaseName: 'jansdb' })).toBe(false)
  })

  it('returns false for empty object', () => {
    expect(isPersistenceInfo({})).toBe(false)
  })
})
