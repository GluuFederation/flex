// Asset saga specific type definitions

// Define the auth state interface
export interface AuthState {
  token: {
    access_token: string
  }
  issuer: string
  userinfo_jwt: string
}

// Define root state interface for asset saga
export interface AssetRootState {
  authReducer: AuthState
}
