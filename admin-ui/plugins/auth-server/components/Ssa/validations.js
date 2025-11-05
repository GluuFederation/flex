import * as Yup from 'yup'

export const ssaValidationSchema = Yup.object({
  software_id: Yup.string().required('Required!'),
  org_id: Yup.string().required('Required!'),
  description: Yup.string().optional(),
  software_roles: Yup.array().optional(),
  grant_types: Yup.array().optional(),
  one_time_use: Yup.boolean().optional(),
  rotate_ssa: Yup.boolean().optional(),
  expiration: Yup.number().nullable().optional(),
})

export default ssaValidationSchema
