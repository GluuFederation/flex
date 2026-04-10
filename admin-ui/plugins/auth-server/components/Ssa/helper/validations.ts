import * as Yup from 'yup'
import dayjs from 'dayjs'
import i18n from '@/i18n'
import type { SsaFormValues } from '../types'

export const getSsaValidationSchema = () =>
  Yup.object<Record<keyof SsaFormValues, Yup.AnySchema>>({
    software_id: Yup.string()
      .trim()
      .required(() => i18n.t('validation_messages.software_id_required'))
      .min(3, () => i18n.t('validation_messages.software_id_min_length')),
    org_id: Yup.string()
      .trim()
      .required(() => i18n.t('validation_messages.org_id_required'))
      .min(3, () => i18n.t('validation_messages.org_id_min_length')),
    description: Yup.string()
      .trim()
      .required(() => i18n.t('validation_messages.description_required'))
      .min(10, () => i18n.t('validation_messages.description_min_length')),
    software_roles: Yup.array()
      .of(
        Yup.mixed().test(
          'is-string-or-object',
          () => i18n.t('validation_messages.software_role_invalid'),
          (value) => {
            return typeof value === 'string' || (value && typeof value === 'object')
          },
        ),
      )
      .min(1, () => i18n.t('validation_messages.software_roles_min'))
      .required(() => i18n.t('validation_messages.software_roles_required')),
    grant_types: Yup.array()
      .of(
        Yup.mixed().test(
          'is-string-or-object',
          () => i18n.t('validation_messages.grant_type_invalid'),
          (value) => {
            return typeof value === 'string' || (value && typeof value === 'object')
          },
        ),
      )
      .min(1, () => i18n.t('validation_messages.grant_types_min'))
      .required(() => i18n.t('validation_messages.grant_types_required')),
    one_time_use: Yup.boolean(),
    rotate_ssa: Yup.boolean(),
    is_expirable: Yup.boolean(),
    expirationDate: Yup.mixed()
      .nullable()
      .test(
        'required-when-expirable',
        () => i18n.t('validation_messages.expiration_date_required'),
        function (value) {
          const { is_expirable } = this.parent as SsaFormValues
          if (!is_expirable) {
            return true
          }
          return value != null
        },
      )
      .test(
        'future-date',
        () => i18n.t('validation_messages.expiration_date_future'),
        function (value) {
          const { is_expirable } = this.parent as SsaFormValues
          if (!is_expirable || !value) {
            return true
          }

          const dateValue = dayjs(value as dayjs.Dayjs | Date | string | number)
          if (!dateValue.isValid()) {
            return false
          }

          return dateValue.isAfter(dayjs())
        },
      ),
  }) as Yup.ObjectSchema<SsaFormValues>
