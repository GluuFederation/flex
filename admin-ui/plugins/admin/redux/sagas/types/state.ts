import { CustomScript, ScriptType } from './customScript'
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
    items: CustomScript[]
    loading: boolean
    view: boolean
    saveOperationFlag: boolean
    errorInSaveOperationFlag: boolean
    totalItems: number
    entriesCount: number
    scriptTypes: ScriptType[]
    hasFetchedScriptTypes: boolean
    loadingScriptTypes: boolean
    item?: CustomScript
  }
  webhookReducer: {
    featureToTrigger: string
    featureWebhooks: Webhook[]
  }
}
