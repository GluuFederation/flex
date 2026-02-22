import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import { hasHttpBody as hasHttpBodyStrict } from 'Plugins/admin/helper/webhook'

const hasHttpBody = (method?: string): boolean => hasHttpBodyStrict(method ?? '')

export const getWebhookValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    httpMethod: Yup.string().required(t('messages.http_method_error')),
    displayName: Yup.string()
      .required(t('messages.display_name_error'))
      .matches(/^\S*$/, `${t('fields.webhook_name')} ${t('messages.no_spaces')}`),
    url: Yup.string().required(t('messages.url_error')),
    httpRequestBody: Yup.string().when('httpMethod', {
      is: hasHttpBody,
      then: () => Yup.string().required(t('messages.request_body_error')),
    }),
    httpHeaders: Yup.array()
      .of(
        Yup.object().shape({
          key: Yup.string().nullable(),
          value: Yup.string().nullable(),
          source: Yup.string().nullable(),
          destination: Yup.string().nullable(),
        }),
      )
      .when('httpMethod', {
        is: hasHttpBody,
        then: (schema) => schema.min(1, t('messages.http_headers_required')),
      })
      .test('headers-key-value', t('messages.additional_parameters_required'), (headers) => {
        if (!headers || headers.length === 0) return true
        return headers.every((header) => {
          if (!header) return false
          const key = (header.key ?? header.source ?? '').trim()
          const value = (header.value ?? header.destination ?? '').trim()
          return Boolean(key) && Boolean(value)
        })
      }),
  })
