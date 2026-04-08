import type { ReactNode } from 'react'

export type OAuthConfigParameter = {
  key?: string
  value?: string
}

export type OAuthConfig = {
  additionalParameters?: OAuthConfigParameter[]
  acrValues?: string
  clientId?: string
  redirectUrl?: string
  scope?: string
}

export type AppAuthProviderProps = {
  children: ReactNode
}
