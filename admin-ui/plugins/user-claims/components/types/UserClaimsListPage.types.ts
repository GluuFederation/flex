type ModifiedFieldValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | AttributeValidation
  | null

export type ModifiedFields = {
  [key: string]: ModifiedFieldValue
}

export type SubmitData = {
  data: AttributeItem
  userMessage?: string
  modifiedFields?: ModifiedFields
}

type AttributeValidation = {
  regexp?: string | null
  minLength?: number | null
  maxLength?: number | null
}

export type AttributeItem = {
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

export type AttributeFormValues = {
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

export type AttributeFormProps = {
  item: AttributeItem
  customOnSubmit: (data: SubmitData) => void
  hideButtons?: Record<string, boolean>
}

export type HandleAttributeSubmitParams = {
  item: AttributeItem
  values: AttributeFormValues
  customOnSubmit: (data: SubmitData) => void
  userMessage?: string
}
