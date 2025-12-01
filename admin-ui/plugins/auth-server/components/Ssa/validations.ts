import * as Yup from 'yup'
import type { SsaFormValues } from './types'

export const ssaValidationSchema = Yup.object<Record<keyof SsaFormValues, Yup.AnySchema>>({
  software_id: Yup.string(),
  org_id: Yup.string(),
  description: Yup.string(),
  software_roles: Yup.array().of(Yup.string()),
  grant_types: Yup.array().of(Yup.string()),
  one_time_use: Yup.boolean(),
  rotate_ssa: Yup.boolean(),
}) as Yup.ObjectSchema<SsaFormValues>

export default ssaValidationSchema
