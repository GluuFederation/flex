import * as Yup from 'yup'
import dayjs from 'dayjs'
import type { SsaFormValues } from './types'

export const ssaValidationSchema = Yup.object<Record<keyof SsaFormValues, Yup.AnySchema>>({
  software_id: Yup.string().required('Software ID is required'),
  org_id: Yup.string(),
  description: Yup.string().required('Description is required'),
  software_roles: Yup.array().of(Yup.string()),
  grant_types: Yup.array().of(Yup.string()),
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
      // value is expected to be a Dayjs here
      return dayjs((value as Date).valueOf()).isAfter(dayjs())
    }),
}) as Yup.ObjectSchema<SsaFormValues>

export default ssaValidationSchema
