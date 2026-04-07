import * as Yup from 'yup'

const stringArraySchema = () =>
  Yup.array().of(Yup.string().trim().required('errors.required')).ensure()

interface ScopeValidationOptions {
  isExistingScope?: boolean
}

export const getScopeValidationSchema = ({
  isExistingScope = false,
}: ScopeValidationOptions = {}) =>
  Yup.object({
    id: Yup.string()
      .required('errors.scope_id_required')
      .min(2, 'errors.scope_id_min_length'),
    displayName: Yup.string()
      .required('errors.scope_display_name_required')
      .min(2, 'errors.scope_display_name_min_length'),
    scopeType: Yup.string().trim().required('errors.scope_type_required'),
    dynamicScopeScripts: stringArraySchema().when('scopeType', {
      is: (scopeType: string) => scopeType === 'dynamic',
      then: (schema) =>
        schema.min(1, 'errors.scope_dynamic_scripts_required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    claims: stringArraySchema().when('scopeType', {
      is: (scopeType: string) => scopeType === 'openid' || scopeType === 'dynamic',
      then: (schema) => schema.min(1, 'errors.scope_claims_required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    umaAuthorizationPolicies: stringArraySchema().when('scopeType', {
      is: (scopeType: string) => scopeType === 'uma',
      then: (schema) =>
        isExistingScope
          ? schema.notRequired()
          : schema.min(1, 'errors.scope_uma_policies_required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    iconUrl: Yup.string()
      .trim()
      .when('scopeType', {
        is: (scopeType: string) => scopeType === 'uma',
        then: (schema) =>
          isExistingScope
            ? schema.notRequired()
            : schema.required('errors.scope_icon_url_required').url('errors.scope_icon_url_invalid'),
        otherwise: (schema) => schema.notRequired(),
      }),
  })
