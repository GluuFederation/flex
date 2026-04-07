import type { ReactNode } from 'react'

export interface OAuthConfigParameter {
  key?: string
  value?: string
}

export interface OAuthConfig {
  additionalParameters?: OAuthConfigParameter[]
  acrValues?: string
  clientId?: string
  redirectUrl?: string
  scope?: string
}

export interface AppAuthProviderProps {
  children: ReactNode
}
