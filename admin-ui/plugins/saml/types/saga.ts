export interface SamlAuthState {
  token: {
    access_token: string
  }
  issuer: string
  userinfo_jwt: string
}

export interface SamlRootState {
  authReducer: SamlAuthState
}

export type {
  SamlConfiguration as SamlProperties,
  PutSamlPropertiesPayload as PutSamlPropertiesSagaPayload,
} from './redux'

type SamlAction<TData> = {
  action: {
    action_message: string
    action_data: TData
  }
}

type SamlActionWithInum<TData> = {
  action: {
    action_message: string
    action_data: TData
    action_inum: string
  }
}

export interface CreateSamlIdentitySagaPayload extends SamlAction<FormData> {}
export interface UpdateSamlIdentitySagaPayload extends SamlActionWithInum<FormData> {}
export interface DeleteSamlIdentitySagaPayload extends SamlAction<string> {}
export interface CreateWebsiteSsoServiceProviderSagaPayload extends SamlAction<FormData> {}
export interface UpdateWebsiteSsoServiceProviderSagaPayload extends SamlActionWithInum<FormData> {}
export interface DeleteWebsiteSsoServiceProviderSagaPayload extends SamlAction<string> {}
