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

export interface PutSamlPropertiesSagaPayload {
  action: {
    action_message: string
    action_data: unknown
  }
  [key: string]: unknown
}

export interface CreateSamlIdentitySagaPayload {
  action: {
    action_message: string
    action_data: FormData
  }
  [key: string]: unknown
}

export interface UpdateSamlIdentitySagaPayload {
  action: {
    action_message: string
    action_data: FormData
    action_inum: string
  }
  [key: string]: unknown
}

export interface DeleteSamlIdentitySagaPayload {
  action: {
    action_data: string
  }
  [key: string]: unknown
}

export interface CreateTrustRelationshipSagaPayload {
  action: {
    action_message: string
    action_data: FormData
  }
  [key: string]: unknown
}

export interface UpdateTrustRelationshipSagaPayload {
  action: {
    action_message: string
    action_data: FormData
    action_inum: string
  }
  [key: string]: unknown
}

export interface DeleteTrustRelationshipSagaPayload {
  action: {
    action_message?: string
    action_data: string
  }
  [key: string]: unknown
}
