import * as Yup from 'yup'

export function getPropertiesConfig(entry) {
  if (
    entry.configurationProperties &&
    Array.isArray(entry.configurationProperties)
  ) {
    return entry.configurationProperties.map((e) => ({
      key: e.value1,
      value: e.value2,
    }))
  } else {
    return []
  }
}

export const scriptValidationSchema = Yup.object({
  name: Yup.string()
    .matches(/\w/, 'Name should contain only letters, digits and underscores')
    .min(2, 'Mininum 2 characters')
    .required('Required!'),
  description: Yup.string(),
  scriptType: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
  programmingLanguage: Yup.string()
    .min(3, 'This value is required')
    .required('Required!'),
  script: Yup.string().required('Required!'),
})

export const scriptInitValues = (item) => {
  return {
    name: item.name,
    description: item.description,
    scriptType: item.scriptType,
    programmingLanguage: item.programmingLanguage,
    level: item.level,
    script: item.script,
    aliases: item.aliases,
    moduleProperties: item.moduleProperties,
    configurationProperties: item.configurationProperties,
  }
}
export const submitScriptForm = (values, item) => {
  values.level = item.level
  values.moduleProperties = item.moduleProperties
  // eslint-disable-next-line no-extra-boolean-cast
  if (values.configurationProperties) {
    values.configurationProperties = values.configurationProperties
      .filter((e) => e != null)
      .filter((e) => Object.keys(e).length !== 0)
      .map((e) => ({
        value1: e.key || e.value1,
        value2: e.value || e.value2,
        hide: false,
      }))
  }
  if (typeof values.enabled == 'object') {
    if (values.enabled.length > 0) {
      values.enabled = true
    } else {
      values.enabled = false
    }
  }
  const result = { ...item, ...values }
  const reqBody = { customScript: result }

  return reqBody
}
