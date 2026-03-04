import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from '@/utils/queryUtils'

export const DEFAULT_SCRIPT_TYPE = 'person_authentication'

export const QUERY_KEY_PREFIX_SCRIPTS_BY_TYPE = '/api/v1/config/scripts/type/'
export const QUERY_KEY_PREFIX_SCRIPTS = '/api/v1/config/scripts/'
export const QUERY_KEY_GET_CONFIG_SCRIPTS_BY_TYPE = 'getConfigScriptsByType'

export const SCRIPT_CACHE_CONFIG = {
  STALE_TIME: DEFAULT_STALE_TIME,
  GC_TIME: DEFAULT_GC_TIME,
  SINGLE_SCRIPT_STALE_TIME: 2 * 60 * 1000,
  SCRIPT_TYPES_STALE_TIME: 30 * 60 * 1000,
  SCRIPT_TYPES_GC_TIME: 60 * 60 * 1000,
}

export const SAML_ACRS_OPTIONS = [
  'urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocol',
  'urn:oasis:names:tc:SAML:2.0:ac:classes:Password',
  'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
]

export const PROGRAMMING_LANGUAGES = [
  { value: 'java', labelKey: 'options.java' as const },
  { value: 'python', labelKey: 'options.jython' as const },
]

export const LOCATION_TYPE_DB = 'db'
export const LOCATION_TYPE_FILE = 'file'

export const LOCATION_TYPES = [
  { value: LOCATION_TYPE_DB, labelKey: 'options.database' as const },
  { value: LOCATION_TYPE_FILE, labelKey: 'options.file' as const },
]

export const INTERACTIVE_OPTIONS = [
  { value: 'interactive', labelKey: 'options.usage_type_web' as const },
  { value: 'service', labelKey: 'options.usage_type_native' as const },
  { value: 'both', labelKey: 'options.usage_type_both' as const },
]

export const SORT_COLUMNS = ['inum', 'description'] as const
export const SORT_COLUMN_LABELS: Record<string, string> = {
  inum: 'fields.inum',
  description: 'fields.description',
}
export const DEFAULT_SORT_BY = 'inum'

export const FEATURE_CUSTOM_SCRIPT_WRITE = 'custom_script_write'
export const FEATURE_CUSTOM_SCRIPT_DELETE = 'custom_script_delete'
