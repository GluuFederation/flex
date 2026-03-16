export interface Role {
  role: string
  inum?: string
}

import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type FormFieldValue = JsonValue | undefined

export interface UserFormValues {
  [key: string]: string | string[] | boolean | null | undefined
}

export interface ThemeContext {
  state: {
    theme: string
  }
}
