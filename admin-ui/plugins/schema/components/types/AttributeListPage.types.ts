import type { JansAttribute } from 'JansConfigApi'
import type { CedarPermissionsState } from '@/cedarling/types'

// Root state interface for component usage (minimal, no Redux)
export interface RootState {
  cedarPermissions: CedarPermissionsState
}

// Define the form submission data interface
export interface SubmitData {
  data: AttributeItem
  userMessage?: string
}

export interface ThemeState {
  theme: string
}

export interface ThemeContextType {
  state: ThemeState
}

// Define the component props interface
export interface AttributeDetailPageProps {
  row: JansAttribute
}

// Define the theme context interface
export interface DetailThemeContextType {
  state: {
    theme: string
  }
}

export interface OptionsChangeEvent {
  target: {
    name: string
    value: string
  }
  keyCode?: number
}

export interface StyledBadgeProps {
  status: string
}

export interface AttributeValidation {
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
  customOnSubmit: (data: { data: AttributeItem; userMessage?: string }) => void
  hideButtons?: Record<string, boolean>
}

export interface HandleAttributeSubmitParams {
  item: AttributeItem
  values: AttributeFormValues
  customOnSubmit: (data: { data: AttributeItem; userMessage?: string }) => void
  userMessage?: string
}
