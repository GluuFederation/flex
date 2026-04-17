import type React from 'react'
import type { HealthServiceKey, HealthStatusResponse } from 'Redux/features/healthSlice'
import type { PageConfig } from '../Layout/types'

export type { PageConfig }

export type SidebarProps = {
  children?: React.ReactNode
  slim?: boolean
  collapsed?: boolean
  animationsDisabled?: boolean
  pageConfig: PageConfig
}

export type MenuItem = {
  icon?: string
  path?: string
  title?: string
  permission?: string
  resourceKey?: string
  children?: MenuItem[]
  cedarlingPassed?: boolean
}

export type PluginMenu = MenuItem

export type ThemeColors = {
  menu: {
    background: string
    [key: string]: string
  }
}

export type ThemeContextState = {
  state: {
    theme: string
  }
}

type HealthVisibilityPath = '/jans-lock' | '/fido/fidomanagement' | '/scim' | '/saml'

export type VisibilityConditions = {
  readonly [P in HealthVisibilityPath]: HealthServiceKey
}

export type IconStyles = {
  readonly [key: string]: React.CSSProperties
}

export type MenuIconMap = {
  readonly [key: string]: React.ReactNode
}

export type SidebarRootState = {
  authReducer: {
    token?: {
      scopes: string[]
    }
    permissions?: string[]
  }
  healthReducer: {
    health: HealthStatusResponse
  }
  logoutAuditReducer: {
    logoutAuditInFlight: boolean
    logoutAuditSucceeded: boolean | null
  }
}
