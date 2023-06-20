export interface TDefautAttribute {
  jansHideOnDiscovery: boolean
  selected: boolean
  scimCustomAttr: boolean
  oxMultiValuedAttribute: boolean
  custom: boolean
  requred: boolean
  attributeValidation: TAttributeValidation
}

interface TAttributeValidation {
  maxLength: any
  regexp: any
  minLength: any
}
