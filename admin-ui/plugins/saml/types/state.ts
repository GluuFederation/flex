import type { SamlReduxState } from './redux'

export interface SamlRootState {
  idpSamlReducer: SamlReduxState
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
  }
}
