import { CustomScriptItem } from '../../features/types/customScript'
import { ScriptType } from '../../features/types/customScript'
import { Webhook } from './webhook'

export interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  customScriptReducer: {
    items: CustomScriptItem[]
    loading: boolean
    view: boolean
    saveOperationFlag: boolean
    errorInSaveOperationFlag: boolean
    totalItems: number
    entriesCount: number
    scriptTypes: ScriptType[]
    hasFetchedScriptTypes: boolean
    loadingScriptTypes: boolean
    item?: CustomScriptItem
  }
  webhookReducer: {
    featureToTrigger: string
    featureWebhooks: Webhook[]
  }
}
