import * as Yup from 'yup'

export const customScriptValidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z0-9_]+$/, 'Name should contain only letters, digits and underscores')
    .min(2, 'Minimum 2 characters')
    .required('Required!'),
  description: Yup.string(),
  scriptType: Yup.string().min(2, 'Minimum 2 characters').required('Required!'),
  programmingLanguage: Yup.string().min(3, 'Must be at least 3 characters').required('Required!'),
  level: Yup.number()
    .typeError('Level must be a number')
    .integer('Level must be an integer')
    .min(0, 'Level must be non-negative')
    .required('Required!'),
  script: Yup.string().when('location_type', (values, schema) => {
    const locationType = values[0] as string
    return locationType === 'db' ? schema.required('Required!') : schema
  }),
  script_path: Yup.string().when('location_type', (values, schema) => {
    const locationType = values[0] as string
    return locationType === 'file' ? schema.required('Required!') : schema
  }),

  moduleProperties: Yup.array()
    .of(
      Yup.object({
        value1: Yup.string().optional(),
        value2: Yup.string().optional(),
      }),
    )
    .when('scriptType', (values, schema) => {
      const scriptType = values[0] as string
      if (scriptType !== 'person_authentication') {
        return schema
      }

      return schema
        .test(
          'usage-type-present',
          'Interactive is required for person_authentication',
          (arr?: Array<{ value1?: string; value2?: string }>) => {
            if (!Array.isArray(arr)) return false
            const prop = arr.find((p) => p?.value1 === 'usage_type')
            return !!(prop && prop.value2 && prop.value2.trim().length > 0)
          },
        )
        .test(
          'usage-type-valid',
          'Interactive must be one of interactive, service, or both',
          (arr?: Array<{ value1?: string; value2?: string }>) => {
            if (!Array.isArray(arr)) return true
            const prop = arr.find((p) => p?.value1 === 'usage_type')
            if (!prop || !prop.value2) return true
            return ['interactive', 'service', 'both'].includes(prop.value2)
          },
        )
    }),
})
