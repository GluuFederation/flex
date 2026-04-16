import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import { uriValidator } from 'Plugins/auth-server/utils'

const optionalUri = (t: TFunction, fieldLabel: string) =>
  Yup.string()
    .nullable()
    .transform((value: string | null | undefined) =>
      value == null || String(value).trim() === '' ? null : String(value).trim(),
    )
    .test(
      'valid-uri',
      t('validation_messages.field_invalid_url', { field: fieldLabel }),
      (value) => {
        if (value == null) return true
        return uriValidator(value)
      },
    )

export const getClientValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    clientName: Yup.string()
      .trim()
      .required(t('validation_messages.client_name_required'))
      .min(5, t('validation_messages.field_min_length', { field: t('fields.client_name'), min: 5 }))
      .max(
        200,
        t('validation_messages.field_max_length', { field: t('fields.client_name'), max: 200 }),
      ),

    clientSecret: Yup.string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value == null || String(value).trim() === '' ? null : String(value).trim(),
      )
      .test(
        'min-if-provided',
        t('validation_messages.field_min_length', { field: t('fields.client_secret'), min: 8 }),
        (v) => v == null || v.length >= 8,
      )
      .test(
        'max-if-provided',
        t('validation_messages.field_max_length', { field: t('fields.client_secret'), max: 256 }),
        (v) => v == null || v.length <= 256,
      ),

    description: Yup.string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value == null || String(value).trim() === '' ? null : String(value).trim(),
      )
      .test(
        'min-if-provided',
        t('validation_messages.field_min_length', { field: t('fields.description'), min: 5 }),
        (v) => v == null || v.length >= 5,
      )
      .test(
        'max-if-provided',
        t('validation_messages.field_max_length', { field: t('fields.description'), max: 500 }),
        (v) => v == null || v.length <= 500,
      ),

    sectorIdentifierUri: optionalUri(t, t('fields.sector_uri')),
    initiateLoginUri: optionalUri(t, t('fields.initiateLoginUri')),

    redirectUris: Yup.array()
      .of(
        Yup.string().test(
          'valid-uri',
          t('validation_messages.field_invalid_url', { field: t('fields.redirect_uris') }),
          (value) => {
            if (!value) return true
            return uriValidator(value)
          },
        ),
      )
      .min(1, t('validation_messages.redirect_uri_required')),

    accessTokenLifetime: Yup.number()
      .transform((_v, orig) => (orig === '' || orig == null ? undefined : Number(orig)))
      .typeError(
        t('validation_messages.field_invalid_number', { field: t('fields.accessTokenLifetime') }),
      )
      .integer(
        t('validation_messages.field_invalid_number', { field: t('fields.accessTokenLifetime') }),
      )
      .min(
        1,
        t('validation_messages.field_must_be_positive', {
          field: t('fields.accessTokenLifetime'),
        }),
      ),

    refreshTokenLifetime: Yup.number()
      .transform((_v, orig) => (orig === '' || orig == null ? undefined : Number(orig)))
      .typeError(
        t('validation_messages.field_invalid_number', { field: t('fields.refreshTokenLifetime') }),
      )
      .integer(
        t('validation_messages.field_invalid_number', { field: t('fields.refreshTokenLifetime') }),
      )
      .min(
        1,
        t('validation_messages.field_must_be_positive', {
          field: t('fields.refreshTokenLifetime'),
        }),
      ),

    defaultMaxAge: Yup.number()
      .transform((_v, orig) => (orig === '' || orig == null ? undefined : Number(orig)))
      .typeError(
        t('validation_messages.field_invalid_number', { field: t('fields.defaultMaxAge') }),
      )
      .integer(t('validation_messages.field_invalid_number', { field: t('fields.defaultMaxAge') }))
      .min(
        1,
        t('validation_messages.field_must_be_positive', { field: t('fields.defaultMaxAge') }),
      ),

    idTokenTokenBindingCnf: Yup.string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value == null || String(value).trim() === '' ? null : String(value).trim(),
      )
      .test(
        'max-if-provided',
        t('validation_messages.field_max_length', {
          field: t('fields.idTokenTokenBindingCnf'),
          max: 512,
        }),
        (v) => v == null || v.length <= 512,
      ),

    frontChannelLogoutUri: optionalUri(t, t('fields.frontChannelLogoutUri')),

    clientUri: optionalUri(t, t('fields.clientUri')),
    policyUri: optionalUri(t, t('fields.policy_uri')),
    logoUri: optionalUri(t, t('fields.logo_uri')),
    tosUri: optionalUri(t, t('fields.tosUri')),
    jwksUri: optionalUri(t, t('fields.jwks_uri')),

    jwks: Yup.string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value == null || String(value).trim() === '' ? null : String(value).trim(),
      )
      .test(
        'max-if-provided',
        t('validation_messages.field_max_length', { field: t('fields.jwks'), max: 8192 }),
        (v) => v == null || v.length <= 8192,
      ),

    softwareId: Yup.string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value == null || String(value).trim() === '' ? null : String(value).trim(),
      )
      .test(
        'max-if-provided',
        t('validation_messages.field_max_length', { field: t('fields.softwareId'), max: 64 }),
        (v) => v == null || v.length <= 64,
      ),

    softwareVersion: Yup.string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value == null || String(value).trim() === '' ? null : String(value).trim(),
      )
      .test(
        'max-if-provided',
        t('validation_messages.field_max_length', { field: t('fields.softwareVersion'), max: 64 }),
        (v) => v == null || v.length <= 64,
      ),

    softwareStatement: Yup.string()
      .nullable()
      .transform((value: string | null | undefined) =>
        value == null || String(value).trim() === '' ? null : String(value).trim(),
      )
      .test(
        'max-if-provided',
        t('validation_messages.field_max_length', {
          field: t('fields.softwareStatement'),
          max: 8192,
        }),
        (v) => v == null || v.length <= 8192,
      ),

    backchannelClientNotificationEndpoint: optionalUri(
      t,
      t('fields.backchannelClientNotificationEndpoint'),
    ),

    attributes: Yup.object().shape({
      redirectUrisRegex: Yup.string()
        .nullable()
        .transform((value: string | null | undefined) =>
          value == null || String(value).trim() === '' ? null : String(value).trim(),
        )
        .test(
          'valid-regex',
          t('validation_messages.field_invalid_regex', { field: t('fields.redirectUrisRegex') }),
          (value) => {
            if (value == null) return true
            try {
              return new RegExp(value) instanceof RegExp
            } catch {
              return false
            }
          },
        ),

      tlsClientAuthSubjectDn: Yup.string()
        .nullable()
        .transform((value: string | null | undefined) =>
          value == null || String(value).trim() === '' ? null : String(value).trim(),
        )
        .test(
          'max-if-provided',
          t('validation_messages.field_max_length', {
            field: t('fields.tls_client_auth_subject_dn'),
            max: 256,
          }),
          (v) => v == null || v.length <= 256,
        ),

      parLifetime: Yup.number()
        .transform((_v, orig) => (orig === '' || orig == null ? undefined : Number(orig)))
        .typeError(
          t('validation_messages.field_invalid_number', { field: t('fields.parLifetime') }),
        )
        .integer(t('validation_messages.field_invalid_number', { field: t('fields.parLifetime') }))
        .min(
          1,
          t('validation_messages.field_must_be_positive', { field: t('fields.parLifetime') }),
        ),

      spontaneousScopes: Yup.array().test(
        'valid-regex-array',
        t('validation_messages.field_invalid_regex', {
          field: t('fields.spontaneousScopesREGEX'),
        }),
        (arr) => {
          if (!Array.isArray(arr) || arr.length === 0) return true
          const value = arr[0]
          if (typeof value !== 'string' || value.trim() === '') return true
          try {
            return new RegExp(value) instanceof RegExp
          } catch {
            return false
          }
        },
      ),
    }),
  })
