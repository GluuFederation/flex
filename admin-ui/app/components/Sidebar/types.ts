import type React from 'react'
import type { HealthServiceKey } from 'Redux/features/types'
import type { ROUTES } from '@/helpers/navigation'
import type { PageConfig } from '../Layout/types'

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

export type ThemeContextState = {
  state: {
    theme: string
  }
}

type HealthVisibilityPath =
  | typeof ROUTES.JANS_LOCK_BASE
  | typeof ROUTES.FIDO_BASE
  | typeof ROUTES.SCIM_BASE
  | typeof ROUTES.SAML_BASE

export type VisibilityConditions = {
  readonly [P in HealthVisibilityPath]: HealthServiceKey
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
  logoutAuditReducer: {
    logoutAuditSucceeded: boolean | null
  }
}
