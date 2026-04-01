export type TestAttribute = {
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  jansHideOnDiscovery: boolean
  scimCustomAttr: boolean
  oxMultiValuedAttribute: boolean
  custom: boolean
  required: boolean
  attributeValidation?: {
    maxLength?: number | null
    regexp?: string | null
    minLength?: number | null
  }
}

export type TestAttributeItem = TestAttribute & {
  usageType?: string[]
  claimName?: string | null
  saml1Uri?: string | null
  saml2Uri?: string | null
}

export type TestFormValues = {
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  jansHideOnDiscovery?: boolean
  oxMultiValuedAttribute?: boolean
  attributeValidation: {
    maxLength?: number | null
    regexp?: string | null
    minLength?: number | null
  }
  scimCustomAttr?: boolean
  claimName?: string | null
  saml1Uri?: string | null
  saml2Uri?: string | null
  maxLength?: number | null
  minLength?: number | null
  regexp?: string | null
}

export type TestFormData = {
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  jansHideOnDiscovery: boolean
  oxMultiValuedAttribute: boolean
  scimCustomAttr: boolean
  attributeValidation: {
    maxLength: number | null
    regexp: string | null
    minLength: number | null
  }
  maxLength: number | null
  minLength: number | null
  regexp: string | null
  claimName: string | null
  saml1Uri: string | null
  saml2Uri: string | null
}
