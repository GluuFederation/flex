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

export interface SamlProperties {
  enabled: boolean
  selectedIdp: string
  ignoreValidation: boolean
  applicationName: string
}

export interface PutSamlPropertiesSagaPayload {
  action: {
    action_message: string
    action_data: SamlProperties
  }
}

export interface CreateSamlIdentitySagaPayload {
  action: {
    action_message: string
    action_data: FormData
  }
}

export interface UpdateSamlIdentitySagaPayload {
  action: {
    action_message: string
    action_data: FormData
    action_inum: string
  }
}

export interface DeleteSamlIdentitySagaPayload {
  action: {
    action_message: string
    action_data: string
  }
}

export interface CreateWebsiteSsoServiceProviderSagaPayload {
  action: {
    action_message: string
    action_data: FormData
  }
}

export interface UpdateWebsiteSsoServiceProviderSagaPayload {
  action: {
    action_message: string
    action_data: FormData
    action_inum: string
  }
}

export interface DeleteWebsiteSsoServiceProviderSagaPayload {
  action: {
    action_message?: string
    action_data: string
  }
}
