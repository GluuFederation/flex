import * as Yup from 'yup'
import type { TFunction } from 'i18next'

export const getSettingsValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    sessionTimeoutInMins: Yup.number()
      .min(1, t('messages.session_timeout_error'))
      .required(t('messages.session_timeout_required_error')),
    additionalParameters: Yup.array()
      .of(
        Yup.object().shape({
          key: Yup.string().nullable(),
          value: Yup.string().nullable(),
        }),
      )
      .test('key-value-required', t('messages.additional_parameters_required'), (params) => {
        if (!params || params.length === 0) {
          return true
        }
        return params.every((param) => {
          if (!param) {
            return true
          }
          const key = (param.key || '').trim()
          const value = (param.value || '').trim()
          // Allow empty rows, but if one field is filled, both must be filled
          if (!key && !value) {
            return true
          }
          return Boolean(key) && Boolean(value)
        })
      }),
  })
