import type { SsaFormValues } from './SsaApiTypes'

export type SsaFormProps = {
  onSubmitData: (payload: SsaFormValues, userMessage: string) => Promise<void>
  isSubmitting: boolean
  customAttributes: string[]
  softwareRolesOptions: string[]
}

export type CustomAttributesPanelProps = {
  availableAttributes: string[]
  selectedAttributes: string[]
  onAttributeSelect: (attribute: string) => void
  searchInputValue: string
  onSearchChange: (value: string) => void
}
