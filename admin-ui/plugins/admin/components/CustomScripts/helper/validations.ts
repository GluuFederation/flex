import * as Yup from 'yup'
import type { TFunction } from 'i18next'

export const getCustomScriptValidationSchema = (t: TFunction) =>
  Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, t('messages.script_name_pattern'))
      .min(2, t('messages.script_min_characters', { count: 2 }))
      .required(t('messages.script_required')),
    description: Yup.string(),
    scriptType: Yup.string()
      .min(2, t('messages.script_min_characters', { count: 2 }))
      .required(t('messages.script_required')),
    programmingLanguage: Yup.string()
      .min(3, t('messages.script_min_length_3'))
      .required(t('messages.script_required')),
    level: Yup.number()
      .typeError(t('messages.script_level_number'))
      .integer(t('messages.script_level_integer'))
      .min(0, t('messages.script_level_non_negative'))
      .required(t('messages.script_required')),
    script: Yup.string().required(t('messages.script_required')),

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
            t('messages.script_usage_type_required'),
            (arr?: Array<{ value1?: string; value2?: string }>) => {
              if (!Array.isArray(arr)) return false
              const prop = arr.find((p) => p?.value1 === 'usage_type')
              return !!(prop && prop.value2 && prop.value2.trim().length > 0)
            },
          )
          .test(
            'usage-type-valid',
            t('messages.script_usage_type_valid'),
            (arr?: Array<{ value1?: string; value2?: string }>) => {
              if (!Array.isArray(arr)) return true
              const prop = arr.find((p) => p?.value1 === 'usage_type')
              if (!prop || !prop.value2) return true
              return ['interactive', 'service', 'both'].includes(prop.value2)
            },
          )
      }),
  })
