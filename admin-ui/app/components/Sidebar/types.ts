// Sidebar-specific type definitions
export interface MenuItem {
  icon?: string
  path?: string
  title?: string
  permission?: string
  children?: MenuItem[]
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

// Visibility and styling types for sidebar
export interface VisibilityConditions {
  readonly [key: string]: string
}

export interface IconStyles {
  readonly [key: string]: React.CSSProperties
}

export interface MenuIconMap {
  readonly [key: string]: React.ReactNode
}

// Sidebar state interface
export interface SidebarState {
  health: Record<string, string>
  isUserLogout: boolean
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
    health: Record<string, string>
  }
  userReducer: {
    isUserLogout: boolean
  }
}
