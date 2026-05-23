import { isPersistenceInfo } from 'Plugins/user-management/utils/persistenceUtils'

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
