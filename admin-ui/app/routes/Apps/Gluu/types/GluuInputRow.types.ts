import type { FormikProps } from 'formik'

import type { JsonValue } from './common'

type HTMLInputType = React.HTMLInputTypeAttribute | 'textarea'

export type GluuInputRowProps<T = Record<string, JsonValue>> = {
  label: string
  name: string
  type?: HTMLInputType
  value?: string | number
  formik?: FormikProps<T> | null
  required?: boolean
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  showError?: boolean
  errorMessage?: string
  handleChange?:
    | ((
        event: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } },
      ) => void)
    | null
  doc_entry?: string
  shortcode?: React.ReactNode
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  rows?: number
  cols?: number
  isDark?: boolean
  placeholder?: string
  allowPasswordToggleWhenDisabled?: boolean
  inputClassName?: string
}
