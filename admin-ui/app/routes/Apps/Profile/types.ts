import type { UserInfo } from 'Redux/features/types/authTypes'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type CustomAttribute = {
  name: string
  values: string[]
}

export type ProfileDetails = {
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

export type ProfileDetailsState = {
  loading: boolean
  profileDetails: ProfileDetails | null
}

export type AuthToken = {
  access_token?: string
  [key: string]: JsonValue | undefined
}

export type AuthState = {
  userinfo?: UserInfo
  token?: AuthToken | null
  issuer?: string | null
  userInum?: string | null
}

export type ProfileRootState = {
  profileDetailsReducer: ProfileDetailsState
  authReducer: AuthState
}

export type InfoRowProps = {
  label: string
  value?: string
  index: number
  classes: {
    dataRow: string
    dataRowEven: string
    dataRowOdd: string
    dataLabel: string
    dataValue: string
  }
}

export type ThemeContextValue = {
  state: {
    theme: string
  }
}
