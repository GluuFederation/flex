import type { UserInfo } from 'Redux/features/types/authTypes'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

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
  [key: string]: JsonValue | CustomAttribute[] | undefined
}

export interface ProfileDetailsState {
  loading: boolean
  profileDetails: ProfileDetails | null
}

export interface AuthToken {
  access_token?: string
  [key: string]: JsonValue | undefined
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

export interface ThemeContextValue {
  state: {
    theme: string
  }
}
