type ModifiedFieldValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | AttributeValidation
  | null

export interface ModifiedFields {
  [key: string]: ModifiedFieldValue
}

export interface SubmitData {
  data: AttributeItem
  userMessage?: string
  modifiedFields?: ModifiedFields
}

type AttributeValidation = {
  regexp?: string | null
  minLength?: number | null
  maxLength?: number | null
}

export interface AttributeItem {
  inum?: string
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType?: string[]
  jansHideOnDiscovery?: boolean
  oxMultiValuedAttribute?: boolean
  attributeValidation: AttributeValidation
  scimCustomAttr?: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
  selected?: boolean
  custom?: boolean
  required?: boolean
}

export interface AttributeFormValues {
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  usageType: string[]
  viewType: string[]
  jansHideOnDiscovery?: boolean
  oxMultiValuedAttribute?: boolean
  attributeValidation: AttributeValidation
  scimCustomAttr?: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
  maxLength?: number | null
  minLength?: number | null
  regexp?: string | null
}

export interface AttributeFormProps {
  item: AttributeItem
  customOnSubmit: (data: SubmitData) => void
  hideButtons?: Record<string, boolean>
}

export interface HandleAttributeSubmitParams {
  item: AttributeItem
  values: AttributeFormValues
  customOnSubmit: (data: SubmitData) => void
  userMessage?: string
}
