import type { Dispatch, SetStateAction } from 'react'
import type { FormikProps } from 'formik'
import type { AppConfiguration, Client, UmaResource } from 'JansConfigApi'
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

export type AddFormValues = Pick<
  Client,
  | 'clientName'
  | 'clientSecret'
  | 'scopes'
  | 'grantTypes'
  | 'redirectUris'
  | 'postLogoutRedirectUris'
> & {
  disabled: boolean
  description: string
}

export interface ClientFormProps {
  client: Partial<ExtendedClient>
  isEdit?: boolean
  viewOnly?: boolean
  onSubmit: (payload: ExtendedClient, message: string, modifiedFields: ModifiedFields) => void
  onCancel?: () => void
}

export interface TabPanelProps {
  formik: FormikProps<ClientFormValues>
  viewOnly?: boolean
  modifiedFields: ModifiedFields
  setModifiedFields: Dispatch<SetStateAction<ModifiedFields>>
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
  scripts: ClientScript[]
  umaResources?: UmaResourceForTab[]
  isEdit?: boolean
  clientInum?: string
}

export interface UrisTabProps extends TabPanelProps {}

export interface SectionProps {
  formik: FormikProps<ClientFormValues>
  viewOnly?: boolean
  setModifiedFields: Dispatch<SetStateAction<ModifiedFields>>
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

export type OidcConfiguration = Pick<
  AppConfiguration,
  | 'idTokenSigningAlgValuesSupported'
  | 'idTokenEncryptionAlgValuesSupported'
  | 'idTokenEncryptionEncValuesSupported'
  | 'userInfoSigningAlgValuesSupported'
  | 'userInfoEncryptionAlgValuesSupported'
  | 'userInfoEncryptionEncValuesSupported'
  | 'requestObjectSigningAlgValuesSupported'
  | 'requestObjectEncryptionAlgValuesSupported'
  | 'requestObjectEncryptionEncValuesSupported'
  | 'tokenEndpointAuthMethodsSupported'
  | 'tokenEndpointAuthSigningAlgValuesSupported'
  | 'accessTokenSigningAlgValuesSupported'
  | 'authorizationSigningAlgValuesSupported'
  | 'authorizationEncryptionAlgValuesSupported'
  | 'authorizationEncryptionEncValuesSupported'
  | 'introspectionSigningAlgValuesSupported'
  | 'introspectionEncryptionAlgValuesSupported'
  | 'introspectionEncryptionEncValuesSupported'
  | 'txTokenSigningAlgValuesSupported'
  | 'txTokenEncryptionAlgValuesSupported'
  | 'txTokenEncryptionEncValuesSupported'
  | 'subjectTypesSupported'
> & {
  backchannelAuthenticationRequestSigningAlgValuesSupported?: string[]
  responseTypesSupported?: string[]
  grantTypesSupported?: string[]
  acrValuesSupported?: string[]
  scopesSupported?: string[]
  claimsSupported?: string[]
}

export type UmaResourceForTab = Pick<
  UmaResource,
  'dn' | 'inum' | 'id' | 'name' | 'description' | 'scopes' | 'scopeExpression' | 'iconUri'
>

export type { RootState } from 'Redux/sagas/types/audit'
