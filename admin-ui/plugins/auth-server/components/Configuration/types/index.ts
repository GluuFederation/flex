import type { JsonPatch } from 'JansConfigApi'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types'
import type { Accordion } from 'Components'
import type React from 'react'
import type { UserAction, ActionData } from 'Utils/PermChecker'

export interface AppConfiguration {
  [key: string]: string | number | boolean | string[] | AppConfiguration | null | undefined
}

export interface SchemaProperty {
  type?: string
  items?: {
    type?: string
    enum?: string[]
  }
}

export interface SpecSchema {
  components: {
    schemas: {
      AppConfiguration: {
        properties: Record<string, SchemaProperty>
      }
    }
  }
}

export type PropertyValue =
  | string
  | number
  | boolean
  | string[]
  | AppConfiguration
  | null
  | undefined

export interface JsonPropertyBuilderProps {
  propKey: string
  propValue?: PropertyValue
  lSize: number
  path?: string
  handler: (patch: JsonPatch) => void
  parentIsArray?: boolean
  schema?: SchemaProperty
  isRenamedKey?: boolean
  parentKey?: string
  onRemoveFromArray?: () => void
}

export interface DefaultAcrInputOption {
  value: string
  label: string
}

export interface DefaultAcrInputProps {
  label: string
  name: string
  value?: string
  required?: boolean
  lsize?: number
  rsize?: number
  isArray?: boolean
  handler: (put: AcrPutOperation) => void
  options: (string | DefaultAcrInputOption)[]
  path: string
  showSaveButtons?: boolean
}

export interface AcrPutOperation {
  path: string
  value: string
  op: 'replace'
}

export interface Script {
  name: string
  scriptType: string
  enabled: boolean
}

export interface AcrResponse {
  defaultAcr?: string
}

export interface RootState {
  jsonConfigReducer: {
    configuration: AppConfiguration
    loading: boolean
  }
  acrReducer: {
    acrReponse: AcrResponse
  }
  initReducer: {
    scripts: Script[]
  }
  cedarPermissions: {
    permissions: Record<string, boolean>
  }
}

export type AccordionWithSubComponents = typeof Accordion & {
  Header: React.ComponentType<React.PropsWithChildren<{ style?: React.CSSProperties }>>
  Body: React.ComponentType<React.PropsWithChildren>
}

export interface JsonConfigActionPayload {
  action: UserAction
}

export interface JsonConfigGetAction {
  type: 'jsonConfig/getJsonConfig'
  payload: JsonConfigActionPayload
  [key: string]: string | JsonConfigActionPayload
}

export interface JsonConfigPatchAction {
  type: 'jsonConfig/patchJsonConfig'
  payload: JsonConfigActionPayload
  [key: string]: string | JsonConfigActionPayload
}

export interface EditAcrsPayload {
  data: {
    authenticationMethod?: {
      defaultAcr?: string
    }
  }
}

export interface JsonPatchRequestBody {
  requestBody: JsonPatch[]
}

export type { JsonPatch, GluuCommitDialogOperation, JsonValue, UserAction, ActionData }
