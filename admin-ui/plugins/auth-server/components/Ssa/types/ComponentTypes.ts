import type { SsaFormValues, SsaData } from './SsaApiTypes'

export interface SsaFormProps {
  onSubmitData: (payload: SsaFormValues, userMessage: string) => Promise<void>
  isSubmitting: boolean
  customAttributes: string[]
  softwareRolesOptions: string[]
}

export interface SsaDetailViewPageProps {
  row: SsaData
}

export interface CustomAttributesPanelProps {
  availableAttributes: string[]
  selectedAttributes: string[]
  onAttributeSelect: (attribute: string) => void
  searchInputValue: string
  onSearchChange: (value: string) => void
}
