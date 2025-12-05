export interface Role {
  role: string
  inum?: string
}

export interface UserFormValues {
  [key: string]: string | string[] | boolean | null | undefined
}

export interface ThemeContext {
  state: {
    theme: string
  }
}
