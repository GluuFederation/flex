// Common type definitions used across user management components

export interface Role {
  role: string
  inum?: string
}

export interface UserFormValues {
  [key: string]: string | string[] | null | undefined
}

// Define theme context interface
export interface ThemeContext {
  state: {
    theme: string
  }
}
