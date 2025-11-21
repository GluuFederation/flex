import * as Yup from 'yup'

const requiredMessage = 'Required!'

const stringArraySchema = () =>
  Yup.array().of(Yup.string().trim().required(requiredMessage)).ensure()

interface ScopeValidationOptions {
  isExistingScope?: boolean
}

export const getScopeValidationSchema = ({
  isExistingScope = false,
}: ScopeValidationOptions = {}) =>
  Yup.object({
    id: Yup.string().min(2, 'id 2 characters').required(requiredMessage),
    displayName: Yup.string().min(2, 'displayName 2 characters').required(requiredMessage),
    scopeType: Yup.string().trim().required(requiredMessage),
    dynamicScopeScripts: stringArraySchema().when('scopeType', {
      is: (scopeType: string) => scopeType === 'dynamic',
      then: (schema) =>
        schema.min(1, 'Select at least one dynamic scope script').required(requiredMessage),
      otherwise: (schema) => schema.notRequired(),
    }),
    claims: stringArraySchema().when('scopeType', {
      is: (scopeType: string) => scopeType === 'openid' || scopeType === 'dynamic',
      then: (schema) => schema.min(1, 'Select at least one claim').required(requiredMessage),
      otherwise: (schema) => schema.notRequired(),
    }),
    umaAuthorizationPolicies: stringArraySchema().when('scopeType', {
      is: (scopeType: string) => scopeType === 'uma',
      then: (schema) =>
        isExistingScope
          ? schema.notRequired()
          : schema.min(1, 'Select at least one UMA authorization policy').required(requiredMessage),
      otherwise: (schema) => schema.notRequired(),
    }),
    iconUrl: Yup.string()
      .trim()
      .when('scopeType', {
        is: (scopeType: string) => scopeType === 'uma',
        then: (schema) =>
          isExistingScope
            ? schema.notRequired()
            : schema.required(requiredMessage).url('Enter a valid URL'),
        otherwise: (schema) => schema.notRequired(),
      }),
  })
