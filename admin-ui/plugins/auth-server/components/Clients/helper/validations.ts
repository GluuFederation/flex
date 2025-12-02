import * as Yup from 'yup'

const urlSchema = Yup.string().url('Must be a valid URL')

const uriArraySchema = Yup.array().of(Yup.string().url('Must be a valid URL'))

export const clientValidationSchema = Yup.object().shape({
  clientName: Yup.string().nullable(),
  displayName: Yup.string().nullable(),
  redirectUris: Yup.array()
    .of(Yup.string())
    .when('grantTypes', {
      is: (grantTypes: string[]) =>
        grantTypes?.includes('authorization_code') || grantTypes?.includes('implicit'),
      then: (schema) =>
        schema.min(
          1,
          'At least one redirect URI is required for authorization_code or implicit grants',
        ),
      otherwise: (schema) => schema,
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
  accessTokenLifetime: Yup.number().nullable().min(0, 'Must be a positive number'),
  refreshTokenLifetime: Yup.number().nullable().min(0, 'Must be a positive number'),
  defaultMaxAge: Yup.number().nullable().min(0, 'Must be a positive number'),
  expirationDate: Yup.string()
    .nullable()
    .when('expirable', {
      is: true,
      then: (schema) => schema.required('Expiration date is required when client is set to expire'),
      otherwise: (schema) => schema,
    }),
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
    return 'Must be a valid URL'
  }
}

export function validateEmail(email: string): string | null {
  if (!email) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? null : 'Must be a valid email address'
}

export function validatePositiveNumber(value: number | undefined | null): string | null {
  if (value === undefined || value === null) return null
  if (typeof value !== 'number') return 'Must be a number'
  if (value < 0) return 'Must be a positive number'
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
