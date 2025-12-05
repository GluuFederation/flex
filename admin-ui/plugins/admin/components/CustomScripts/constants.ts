export const DEFAULT_SCRIPT_TYPE = 'person_authentication'

export const SCRIPT_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
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
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Jython' },
]

export const LOCATION_TYPE_OPTIONS = [
  { value: 'db', key: 'options.database' },
  { value: 'file', key: 'options.file' },
]
