import * as Yup from 'yup'

export const getInitialState = (item) => {
  return (
    item.attributeValidation?.regexp != null &&
    item.attributeValidation?.minLength != null &&
    item.attributeValidation?.maxLength != null
  )
}

export const attributeValidationSchema = Yup.object({
  name: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
  displayName: Yup.string()
    .min(2, 'Mininum 2 characters')
    .required('Required!'),
  description: Yup.string().required('Required!'),
  status: Yup.string().required('Required!'),
  dataType: Yup.string().required('Required!'),
  editType: Yup.array().required('Required!'),
  usageType: Yup.array().required('Required!')
})

export const handleAttributeSubmit = ({ item, values, customOnSubmit }) => {
  const result = Object.assign(item, values)
  result['attributeValidation'].maxLength = result.maxLength
  result['attributeValidation'].minLength = result.minLength
  result['attributeValidation'].regexp = result.regexp
  customOnSubmit(JSON.stringify(result))
}

export const getInitialAttributeValues = (item) => {
  return {
    name: item.name,
    displayName: item.displayName,
    description: item.displayName,
    status: item.status,
    dataType: item.dataType,
    editType: item.editType,
    viewType: item.viewType,
    usageType: item.usageType,
    jansHideOnDiscovery: item.jansHideOnDiscovery,
    oxMultiValuedAttribute: item.oxMultiValuedAttribute,
    attributeValidation: item.attributeValidation,
    scimCustomAttr: item.scimCustomAttr
  }
}
