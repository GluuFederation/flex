export interface Role {
  role: string
  inum?: string
}

export interface UserFormValues {
  [key: string]: string | string[] | null | undefined
}

export type { ThemeContextType } from 'Context/theme/themeContext'
