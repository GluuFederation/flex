import type { Dispatch, UnknownAction } from '@reduxjs/toolkit'

export interface CustomAttribute {
  name: string
  values: string[]
}

export interface ProfileDetails {
  displayName?: string
  givenName?: string
  mail?: string
  status?: string
  inum?: string
  customAttributes?: CustomAttribute[]
}

export interface UserInfo {
  inum?: string
  family_name?: string
  [key: string]: unknown
}

export interface ProfileDetailsState {
  loading: boolean
  profileDetails: ProfileDetails | null
}

export interface AuthState {
  userinfo?: UserInfo
}

export interface ProfileRootState {
  profileDetailsReducer: ProfileDetailsState
  authReducer: AuthState
}

export type AppDispatch = Dispatch<UnknownAction>

export interface ThemeContextValue {
  state: {
    theme: string
  }
}
