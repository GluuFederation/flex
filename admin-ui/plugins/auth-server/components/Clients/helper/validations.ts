import * as Yup from 'yup'

export function isValidUri(value: string | undefined | null): boolean {
  if (!value || value.trim() === '') return true
  try {
    new URL(value)
    return true
  } catch {
    if (value.startsWith('http://localhost') || value.startsWith('http://127.0.0.1')) {
      return true
    }
    const customSchemeRegex = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+$/
    if (customSchemeRegex.test(value)) {
      return true
    }
    return false
  }
}

export const uriValidation = Yup.string().test(
  'is-valid-uri',
  'Invalid URI format. Must be a valid URL (e.g., https://example.com) or custom scheme (e.g., myapp://callback)',
  isValidUri,
)

const urlSchema = Yup.string().url('Must be a valid URL')

const uriArraySchema = Yup.array().of(uriValidation)

export const clientValidationSchema = Yup.object().shape({
  clientName: Yup.string().nullable(),
  displayName: Yup.string().nullable(),
  redirectUris: Yup.array()
    .of(Yup.string())
    .when('grantTypes', (grantTypes: string[] = [], schema) => {
      const needsRedirect =
        grantTypes.includes('authorization_code') || grantTypes.includes('implicit')
      return needsRedirect
        ? schema.min(
            1,
            'At least one redirect URI is required for authorization_code or implicit grants',
          )
        : schema
    }),
  postLogoutRedirectUris: uriArraySchema.nullable(),
  frontChannelLogoutUri: urlSchema.nullable(),
  initiateLoginUri: urlSchema.nullable(),
  clientUri: urlSchema.nullable(),
  logoUri: urlSchema.nullable(),
  policyUri: urlSchema.nullable(),
  tosUri: urlSchema.nullable(),
  jwksUri: urlSchema.nullable(),
  sectorIdentifierUri: urlSchema.nullable(),
  backchannelClientNotificationEndpoint: urlSchema.nullable(),
  accessTokenLifetime: Yup.number().nullable().min(0, 'Must be a non-negative number'),
  refreshTokenLifetime: Yup.number().nullable().min(0, 'Must be a non-negative number'),
  defaultMaxAge: Yup.number().nullable().min(0, 'Must be a non-negative number'),
  expirationDate: Yup.string()
    .nullable()
    .when('expirable', (expirable: boolean, schema) =>
      expirable
        ? schema.required('Expiration date is required when client is set to expire')
        : schema,
    ),
  contacts: Yup.array().of(Yup.string().email('Must be a valid email')).nullable(),
})

export function validateRedirectUri(uri: string): string | null {
  if (!uri) return 'URI is required'
  try {
    new URL(uri)
    return null
  } catch {
    if (uri.startsWith('http://localhost') || uri.startsWith('http://127.0.0.1')) {
      return null
    }
    const customSchemeRegex = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+$/
    if (customSchemeRegex.test(uri)) {
      return null
    }
    return 'Must be a valid URL or custom scheme URI (e.g., myapp://callback)'
  }
}

export function validateEmail(email: string): string | null {
  if (!email) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? null : 'Must be a valid email address'
}

export function validateNonNegativeNumber(value: number | undefined | null): string | null {
  if (value === undefined || value === null) return null
  if (typeof value !== 'number') return 'Must be a number'
  if (value < 0) return 'Must be a non-negative number'
  return null
}

export function validateRequiredArray(
  arr: unknown[] | undefined | null,
  minLength = 1,
): string | null {
  if (!arr || arr.length < minLength) {
    return `At least ${minLength} item(s) required`
  }
  return null
}

export function validateExpirationDate(expirationDate: string | undefined | null): string | null {
  if (!expirationDate) return null
  const expDate = new Date(expirationDate)
  const now = new Date()
  if (expDate <= now) {
    return 'Expiration date must be in the future'
  }
  return null
}

export function validateTokenLifetime(
  value: number | undefined | null,
  maxSeconds = 315360000,
): string | null {
  if (value === undefined || value === null) return null
  if (value < 0) return 'Must be a non-negative number'
  if (value > maxSeconds) return `Value exceeds maximum allowed (${maxSeconds} seconds)`
  return null
}

export function isValidDn(dn: string | undefined | null): boolean {
  if (!dn) return true
  const dnPattern = /^[a-zA-Z]+=.+/
  return dnPattern.test(dn)
}

export function validateAcrLevel(level: number | undefined | null): string | null {
  if (level === undefined || level === null) return null
  if (!Number.isInteger(level)) return 'ACR level must be an integer'
  if (level < -1 || level > 10) return 'ACR level must be between -1 and 10'
  return null
}
