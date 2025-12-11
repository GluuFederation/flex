import type { FormikProps } from 'formik'
import type { ExtendedClient, ModifiedFields, ClientScope, ClientScript } from './clientTypes'

export type ClientTab = 'basic' | 'authentication' | 'scopes' | 'advanced' | 'uris'

export type ClientSection =
  | 'basic'
  | 'authentication'
  | 'scopes'
  | 'uris'
  | 'tokens'
  | 'ciba'
  | 'scripts'
  | 'localization'
  | 'system'
  | 'activeTokens'

export interface ClientFormValues extends ExtendedClient {
  expirable: boolean
}

export interface AddFormValues {
  clientName: string
  clientSecret: string
  disabled: boolean
  description: string
  scopes: string[]
  grantTypes: string[]
  redirectUris: string[]
  postLogoutRedirectUris: string[]
}

export interface ClientFormProps {
  client: Partial<ExtendedClient>
  isEdit?: boolean
  viewOnly?: boolean
  onSubmit: (values: ClientFormValues, message: string, modifiedFields: ModifiedFields) => void
  onCancel?: () => void
  scopes?: ClientScope[]
  scopesLoading?: boolean
  onScopeSearch?: (pattern: string) => void
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

export interface SectionProps {
  formik: FormikProps<ClientFormValues>
  viewOnly?: boolean
  setModifiedFields: React.Dispatch<React.SetStateAction<ModifiedFields>>
  scripts?: ClientScript[]
  scriptsTruncated?: boolean
  scopes?: ClientScope[]
  scopesLoading?: boolean
  onScopeSearch?: (pattern: string) => void
  oidcConfiguration?: OidcConfiguration
}

export interface SectionConfig {
  id: ClientSection
  labelKey: string
  icon: string
}

export interface OidcConfiguration {
  idTokenSigningAlgValuesSupported?: string[]
  idTokenEncryptionAlgValuesSupported?: string[]
  idTokenEncryptionEncValuesSupported?: string[]
  userinfoSigningAlgValuesSupported?: string[]
  userinfoEncryptionAlgValuesSupported?: string[]
  userinfoEncryptionEncValuesSupported?: string[]
  requestObjectSigningAlgValuesSupported?: string[]
  requestObjectEncryptionAlgValuesSupported?: string[]
  requestObjectEncryptionEncValuesSupported?: string[]
  tokenEndpointAuthMethodsSupported?: string[]
  tokenEndpointAuthSigningAlgValuesSupported?: string[]
  accessTokenSigningAlgValuesSupported?: string[]
  authorizationSigningAlgValuesSupported?: string[]
  authorizationEncryptionAlgValuesSupported?: string[]
  authorizationEncryptionEncValuesSupported?: string[]
  introspectionSigningAlgValuesSupported?: string[]
  introspectionEncryptionAlgValuesSupported?: string[]
  introspectionEncryptionEncValuesSupported?: string[]
  txTokenSigningAlgValuesSupported?: string[]
  txTokenEncryptionAlgValuesSupported?: string[]
  txTokenEncryptionEncValuesSupported?: string[]
  backchannelAuthenticationRequestSigningAlgValuesSupported?: string[]
  responseTypesSupported?: string[]
  grantTypesSupported?: string[]
  acrValuesSupported?: string[]
  subjectTypesSupported?: string[]
  scopesSupported?: string[]
  claimsSupported?: string[]
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

export type { RootState } from 'Redux/sagas/types/audit'
