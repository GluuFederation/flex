import type { Dispatch, SetStateAction } from 'react'
import type { FormikProps } from 'formik'
import type { Client, Scope, TokenEntity, AppConfiguration, CustomScript } from 'JansConfigApi'
import type { Dayjs } from 'dayjs'
import type { ThemeConfig } from '@/context/theme/config'
import type { JsonObject, JsonValue } from '@/routes/Apps/Gluu/types/common'

export type CustomAttribute = {
  name: string
  values: string[]
}

export type ClientRow = {
  inum: string
  clientName?: string
  displayName?: string
  description?: string
  clientSecret?: string
  grantTypes?: string[]
  scopes?: string[]
  redirectUris?: string[]
  responseTypes?: string[]
  postLogoutRedirectUris?: string[]
  trustedClient?: boolean
  applicationType?: string
  subjectType?: string
  authenticationMethod?: string
  disabled?: boolean
  deletable?: boolean
  organization?: string
  o?: string
  dn?: string
  customAttributes?: CustomAttribute[]
}

export type ScopeItem = Scope & {
  clients?: ClientRow[]
}

export type UseClientsParams = {
  limit?: number
  pattern?: string
  startIndex?: number
}

export type DeleteClientParams = {
  inum: string
  message: string
  client?: ClientRow
}

export type AuditContext = {
  userinfo: { name?: string; inum?: string } | null | undefined
  clientId: string | undefined
}

export type ClientShowScopesProps = {
  handler: () => void
  data: string[]
  isOpen: boolean
}

export type ClientShowScopesStyleParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

export type ClientModifiedFields = Record<string, JsonValue>

export type ClientWizardSubmitData = Client & {
  action_message?: string
  modifiedFields?: ClientModifiedFields
}

export type ClientFormInitialData = Omit<Client, 'attributes'> & {
  attributes?: Record<string, JsonValue>
}

export type FilterClientsByScope = (scopeInum: string, scopeDn: string) => ClientRow[]

export type AddOrgFn = (client: ClientRow) => ClientRow

export type ClientShowSpontaneousScopesProps = {
  handler: () => void
  isOpen: boolean
  clientInum?: string
}

export type ClientActiveTokenRowData = {
  creationDate?: string | number | Date
  expirationDate?: string | number | Date | null
  tokenType?: string
  scope?: string
  deletable?: boolean
  attributes?: TokenEntity['attributes']
}

export type ClientActiveTokenDetailPageProps = {
  row: {
    rowData: ClientActiveTokenRowData
  }
}

export type ClientActiveTokensProps = {
  client: { inum?: string }
}

export type TokenSearchFilterField = 'expirationDate' | 'creationDate'

export type TokenSearchPattern = {
  dateAfter: Dayjs | null
  dateBefore: Dayjs | null
}

export type ClientTokenRow = {
  id: string
  tokenCode: string
  tokenType?: string
  scope?: string
  deletable?: boolean
  attributes?: TokenEntity['attributes']
  grantType?: string
  expirationDate: string
  creationDate: string
  enabled?: boolean
}

export type ClientFormValues = JsonObject

export type ClientWizardFormValues = ClientFormInitialData & { expirable: boolean }

export type ClientPanelFormik = FormikProps<ClientWizardFormValues>

export type SetClientModifiedFields = Dispatch<SetStateAction<ClientModifiedFields>>

export type ClientPanelProps = {
  formik: ClientPanelFormik
  viewOnly?: boolean
  modifiedFields: ClientModifiedFields
  setModifiedFields: SetClientModifiedFields
}

export type ClientBasicPanelProps = {
  client: ClientFormInitialData
  formik: ClientPanelFormik
  viewOnly?: boolean
  oidcConfiguration: AppConfiguration | undefined
  modifiedFields: ClientModifiedFields
  setModifiedFields: SetClientModifiedFields
}

export type ClientScriptField = {
  name: string
  labelKey: string
  scriptType: string
  modifiedField: string
}

export type ClientScriptPanelProps = {
  scripts: CustomScript[]
  formik: ClientPanelFormik
  viewOnly?: boolean
  modifiedFields: ClientModifiedFields
  setModifiedFields: SetClientModifiedFields
}

export type ClientAdvancedPanelProps = ClientPanelProps & {
  client: ClientFormInitialData
  scripts: CustomScript[]
}

export type ClientEncryptionSigningPanelProps = ClientPanelProps & {
  oidcConfiguration: AppConfiguration | undefined
}

export type ClientCibaParUmaPanelProps = ClientPanelProps & {
  client: ClientFormInitialData
  scripts: CustomScript[]
  setCurrentStep: (step: string) => void
  sequence: string[]
}

export type ClientWizardFormProps = {
  client_data: ClientFormInitialData
  viewOnly?: boolean
  scripts: CustomScript[]
  permissions?: string[]
  customOnSubmit: (values: ClientWizardSubmitData) => void
  oidcConfiguration: AppConfiguration | undefined
  isEdit?: boolean
  modifiedFields: ClientModifiedFields
  setModifiedFields: SetClientModifiedFields
}
