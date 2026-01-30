import type { Dispatch, UnknownAction } from '@reduxjs/toolkit'
import type { UserInfo } from 'Redux/features/types/authTypes'

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
  sn?: string
  surname?: string
  customAttributes?: CustomAttribute[]
  [key: string]: unknown // Allow additional properties from API
}

export interface ProfileDetailsState {
  loading: boolean
  profileDetails: ProfileDetails | null
}

export interface AuthToken {
  access_token?: string
  [key: string]: unknown
}

export interface AuthState {
  userinfo?: UserInfo
  token?: AuthToken | null
  issuer?: string | null
  userInum?: string | null
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
