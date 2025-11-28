export const API_ATTRIBUTE = 'api-attribute'

export const REQUIRED_ATTRIBUTE_FIELDS = [
  'name',
  'displayName',
  'description',
  'status',
  'dataType',
  'editType',
  'viewType',
  'usageType',
] as const

export type RequiredAttributeField = (typeof REQUIRED_ATTRIBUTE_FIELDS)[number]
