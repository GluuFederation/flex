import type { HealthServiceKey, HealthStatusResponse } from 'Redux/features/healthSlice'

// Sidebar-specific type definitions
export interface MenuItem {
  icon?: string
  path?: string
  title?: string
  permission?: string
  resourceKey?: string
  children?: MenuItem[]
  cedarlingPassed?: boolean
}

export interface PluginMenu extends MenuItem {}

// Theme-related types for sidebar
export interface ThemeColors {
  menu: {
    background: string
    [key: string]: string
  }
  [key: string]: unknown
}

export interface ThemeContextState {
  state: {
    theme: string
  }
}

type HealthVisibilityPath = '/jans-lock' | '/fido/fidomanagement' | '/scim' | '/saml'

export type VisibilityConditions = {
  readonly [P in HealthVisibilityPath]: HealthServiceKey
}

export interface IconStyles {
  readonly [key: string]: React.CSSProperties
}

export interface MenuIconMap {
  readonly [key: string]: React.ReactNode
}

// Root state interface for sidebar selectors
export interface SidebarRootState {
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
