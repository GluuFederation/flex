import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type FormFieldValue = JsonValue | undefined

export type UserFormValues = {
  [key: string]: string | string[] | boolean | null | undefined
}
