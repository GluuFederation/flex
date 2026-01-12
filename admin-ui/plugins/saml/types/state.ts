import type { SamlReduxState } from './redux'

export interface SamlRootState {
  idpSamlReducer: SamlReduxState
  authReducer: {
    issuer: string
  }
}
