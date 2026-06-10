import type { ReactNode } from 'react'

type OAuthConfigParameter = {
  key?: string
  value?: string
}

export type OAuthConfig = {
  additionalParameters?: OAuthConfigParameter[]
  acrValues?: string
  clientId?: string
  redirectUrl?: string
  scope?: string
  postLogoutRedirectUri?: string
}

export type AppAuthProviderProps = {
  children: ReactNode
}
