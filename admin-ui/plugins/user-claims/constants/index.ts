import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from '@/utils/queryUtils'

export const API_ATTRIBUTE = 'api-attribute'

export const REQUIRED_ATTRIBUTE_FIELDS = [
  'name',
  'displayName',
  'description',
  'status',
  'dataType',
  'editType',
  'viewType',
] as const

export type RequiredAttributeField = (typeof REQUIRED_ATTRIBUTE_FIELDS)[number]

export const QUERY_KEY_PREFIX_ATTRIBUTES = '/api/v1/attributes/'

export const ATTRIBUTE_CACHE_CONFIG = {
  STALE_TIME: DEFAULT_STALE_TIME,
  GC_TIME: DEFAULT_GC_TIME,
  SINGLE_ATTRIBUTE_STALE_TIME: 2 * 60 * 1000,
}
