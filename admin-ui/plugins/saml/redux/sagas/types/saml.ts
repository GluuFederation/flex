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
} from '../../../types/redux'

type SamlAction<TData, TInum = never> = {
  action: {
    action_message: string
    action_data: TData
  } & (TInum extends never ? Record<string, never> : { action_inum: TInum })
}

export interface CreateSamlIdentitySagaPayload extends SamlAction<FormData> {}
export interface UpdateSamlIdentitySagaPayload extends SamlAction<FormData, string> {}
export interface DeleteSamlIdentitySagaPayload extends SamlAction<string> {}
export interface CreateWebsiteSsoServiceProviderSagaPayload extends SamlAction<FormData> {}
export interface UpdateWebsiteSsoServiceProviderSagaPayload extends SamlAction<FormData, string> {}
export interface DeleteWebsiteSsoServiceProviderSagaPayload extends SamlAction<string> {}
