import * as Yup from 'yup'
import dayjs from 'dayjs'
import type { SsaFormValues } from './types'

export const ssaValidationSchema = Yup.object<Record<keyof SsaFormValues, Yup.AnySchema>>({
  software_id: Yup.string()
    .trim()
    .required('Software ID is required')
    .min(1, 'Software ID is required'),
  org_id: Yup.string()
    .trim()
    .required('Organization ID is required')
    .min(1, 'Organization ID is required'),
  description: Yup.string()
    .trim()
    .required('Description is required')
    .min(1, 'Description is required'),
  software_roles: Yup.array()
    .of(
      Yup.mixed().test(
        'is-string-or-object',
        'Software role must be a string or object',
        (value) => {
          return typeof value === 'string' || (value && typeof value === 'object')
        },
      ),
    )
    .min(1, 'At least one software role is required')
    .required('Software roles are required'),
  grant_types: Yup.array()
    .of(
      Yup.mixed().test('is-string-or-object', 'Grant type must be a string or object', (value) => {
        return typeof value === 'string' || (value && typeof value === 'object')
      }),
    )
    .min(1, 'At least one grant type is required')
    .required('Grant types are required'),
  one_time_use: Yup.boolean(),
  rotate_ssa: Yup.boolean(),
  is_expirable: Yup.boolean(),
  expirationDate: Yup.mixed()
    .nullable()
    .test('required-when-expirable', 'Expiration date is required', function (value) {
      const { is_expirable } = this.parent as SsaFormValues
      if (!is_expirable) {
        return true
      }
      return value != null
    })
    .test('future-date', 'Expiration date must be in the future', function (value) {
      const { is_expirable } = this.parent as SsaFormValues
      if (!is_expirable || !value) {
        return true
      }

      const dateValue = dayjs(value as dayjs.Dayjs | Date | string | number)
      if (!dateValue.isValid()) {
        return false
      }

      return dateValue.isAfter(dayjs())
    }),
}) as Yup.ObjectSchema<SsaFormValues>

export default ssaValidationSchema
