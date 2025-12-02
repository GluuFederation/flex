import type { FormikProps } from 'formik'
import type { ExtendedClient, ModifiedFields, ClientScope, ClientScript } from './clientTypes'

export type ClientTab = 'basic' | 'authentication' | 'scopes' | 'advanced' | 'uris'

export interface ClientFormValues extends ExtendedClient {
  expirable: boolean
}

export interface ClientFormProps {
  client: Partial<ExtendedClient>
  isEdit?: boolean
  viewOnly?: boolean
  onSubmit: (values: ClientFormValues, message: string, modifiedFields: ModifiedFields) => void
  onCancel?: () => void
}

export interface TabPanelProps {
  formik: FormikProps<ClientFormValues>
  viewOnly?: boolean
  modifiedFields: ModifiedFields
  setModifiedFields: React.Dispatch<React.SetStateAction<ModifiedFields>>
}

export interface BasicInfoTabProps extends TabPanelProps {
  oidcConfiguration?: OidcConfiguration
}

export interface AuthenticationTabProps extends TabPanelProps {
  oidcConfiguration?: OidcConfiguration
}

export interface ScopesGrantsTabProps extends TabPanelProps {
  scopes: ClientScope[]
  scopesLoading?: boolean
  onScopeSearch?: (pattern: string) => void
}

export interface AdvancedTabProps extends TabPanelProps {
  scripts: Array<{ dn: string; name: string; scriptType?: string; enabled?: boolean }>
  umaResources?: UmaResourceForTab[]
  isEdit?: boolean
  clientInum?: string
}

export interface UrisTabProps extends TabPanelProps {}

export interface OidcConfiguration {
  id_token_signing_alg_values_supported?: string[]
  id_token_encryption_alg_values_supported?: string[]
  id_token_encryption_enc_values_supported?: string[]
  userinfo_signing_alg_values_supported?: string[]
  userinfo_encryption_alg_values_supported?: string[]
  userinfo_encryption_enc_values_supported?: string[]
  request_object_signing_alg_values_supported?: string[]
  request_object_encryption_alg_values_supported?: string[]
  request_object_encryption_enc_values_supported?: string[]
  token_endpoint_auth_methods_supported?: string[]
  token_endpoint_auth_signing_alg_values_supported?: string[]
  access_token_signing_alg_values_supported?: string[]
  authorization_signing_alg_values_supported?: string[]
  authorization_encryption_alg_values_supported?: string[]
  authorization_encryption_enc_values_supported?: string[]
  introspection_signing_alg_values_supported?: string[]
  introspection_encryption_alg_values_supported?: string[]
  introspection_encryption_enc_values_supported?: string[]
  tx_token_signing_alg_values_supported?: string[]
  tx_token_encryption_alg_values_supported?: string[]
  tx_token_encryption_enc_values_supported?: string[]
  backchannel_authentication_request_signing_alg_values_supported?: string[]
  response_types_supported?: string[]
  grant_types_supported?: string[]
  acr_values_supported?: string[]
  subject_types_supported?: string[]
  scopes_supported?: string[]
  claims_supported?: string[]
}

export interface UmaResourceForTab {
  dn?: string
  inum?: string
  id?: string
  name?: string
  description?: string
  scopes?: string[]
  scopeExpression?: string
  iconUri?: string
}

export interface AuthState {
  token?: {
    access_token: string
  }
  config?: {
    clientId: string
  }
  userinfo?: {
    inum: string
    name: string
  }
  location?: {
    IPv4?: string
  }
}

export interface RootState {
  authReducer: AuthState
}
