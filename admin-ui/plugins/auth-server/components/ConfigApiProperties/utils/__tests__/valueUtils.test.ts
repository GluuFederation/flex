import {
  updateValuesAfterRemoval,
  applyRemovePatchToValues,
} from 'Plugins/auth-server/components/ConfigApiProperties/utils/valueUtils'
import type {
  ApiAppConfiguration,
  JsonPatch,
} from 'Plugins/auth-server/components/ConfigApiProperties/types'
import { logger } from '@/utils/logger'

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  },
}))

const mockedError = logger.error as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateValuesAfterRemoval', () => {
  it('removes an item from a top-level object array', () => {
    const values: ApiAppConfiguration = {
      corsConfigurationFilters: [{ filterName: 'a' }, { filterName: 'b' }],
    }
    const result = updateValuesAfterRemoval(values, null, 'corsConfigurationFilters', 0)
    expect(result?.corsConfigurationFilters).toEqual([{ filterName: 'b' }])
  })

  it('removes an item from a nested parent object array', () => {
    const values: ApiAppConfiguration = {
      auditLogConf: {
        ignoreObjectMapping: [{ name: 'a' }, { name: 'b' }],
      },
    }
    const result = updateValuesAfterRemoval(values, 'auditLogConf', 'ignoreObjectMapping', 1)
    expect(result?.auditLogConf).toEqual({ ignoreObjectMapping: [{ name: 'a' }] })
  })

  it('returns null when the index is out of range', () => {
    const values: ApiAppConfiguration = {
      corsConfigurationFilters: [{ filterName: 'a' }],
    }
    expect(updateValuesAfterRemoval(values, null, 'corsConfigurationFilters', 5)).toBeNull()
    expect(updateValuesAfterRemoval(values, null, 'corsConfigurationFilters', -1)).toBeNull()
  })

  it('returns null when the target array does not exist', () => {
    const values: ApiAppConfiguration = {}
    expect(updateValuesAfterRemoval(values, null, 'corsConfigurationFilters', 0)).toBeNull()
  })

  it('returns null when the parent record is missing', () => {
    const values: ApiAppConfiguration = {}
    expect(updateValuesAfterRemoval(values, 'auditLogConf', 'headerAttributes', 0)).toBeNull()
  })
})

describe('applyRemovePatchToValues', () => {
  it('ignores patches that are not remove ops', () => {
    const values: ApiAppConfiguration = { apiApprovedIssuer: ['a', 'b'] }
    const patch: JsonPatch = { op: 'add', path: '/apiApprovedIssuer/0' }
    applyRemovePatchToValues(values, patch)
    expect(values.apiApprovedIssuer).toEqual(['a', 'b'])
  })

  it('removes an array element at the given index', () => {
    const values: ApiAppConfiguration = { apiApprovedIssuer: ['a', 'b', 'c'] }
    const patch: JsonPatch = { op: 'remove', path: '/apiApprovedIssuer/1' }
    applyRemovePatchToValues(values, patch)
    expect(values.apiApprovedIssuer).toEqual(['a', 'c'])
  })

  it('does nothing when the path is empty after cleaning', () => {
    const values: ApiAppConfiguration = { apiApprovedIssuer: ['a'] }
    const patch: JsonPatch = { op: 'remove', path: '/' }
    applyRemovePatchToValues(values, patch)
    expect(values.apiApprovedIssuer).toEqual(['a'])
  })

  it('logs an error and rejects malformed paths with empty segments', () => {
    const values: ApiAppConfiguration = { apiApprovedIssuer: ['a'] }
    const patch: JsonPatch = { op: 'remove', path: '/apiApprovedIssuer//0' }
    applyRemovePatchToValues(values, patch)
    expect(values.apiApprovedIssuer).toEqual(['a'])
    expect(mockedError).toHaveBeenCalled()
  })

  it('does nothing when the target value is not found', () => {
    const values: ApiAppConfiguration = { apiApprovedIssuer: ['a'] }
    const patch: JsonPatch = { op: 'remove', path: '/missingField/0' }
    applyRemovePatchToValues(values, patch)
    expect(values.apiApprovedIssuer).toEqual(['a'])
  })

  it('does nothing when the last segment is not a numeric index', () => {
    const values: ApiAppConfiguration = { apiApprovedIssuer: ['a', 'b'] }
    const patch: JsonPatch = { op: 'remove', path: '/apiApprovedIssuer' }
    applyRemovePatchToValues(values, patch)
    expect(values.apiApprovedIssuer).toEqual(['a', 'b'])
  })
})
