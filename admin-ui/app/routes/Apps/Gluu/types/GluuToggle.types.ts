import type { ChangeEvent } from 'react'
import type { FormikProps } from 'formik'
import type { JsonValue } from './common'

export type GluuToggleProps<T = Record<string, JsonValue>> = {
  id?: string
  name: string
  formik?: FormikProps<T> | null
  value?: boolean
  handler?: (event: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}
