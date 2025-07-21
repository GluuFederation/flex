// Redux State Types

import { CustomScriptItem, ScriptType } from './customScript'

export interface CustomScriptReducerState {
  items: CustomScriptItem[]
  item: CustomScriptItem
  loading: boolean
  view: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  scriptTypes: ScriptType[]
  hasFetchedScriptTypes: boolean
  loadingScriptTypes: boolean
}

export interface CedarPermissionsState {
  permissions: string[]
}

export interface RootState {
  customScriptReducer: CustomScriptReducerState
  cedarPermissions: CedarPermissionsState
}
