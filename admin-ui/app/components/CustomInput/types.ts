import type React from 'react'

export type CustomInputProps = {
  'type'?: string
  'id'?: string
  'name'?: string
  'className'?: string
  'label'?: string
  'disabled'?: boolean
  'value'?: string | number | readonly string[]
  'defaultValue'?: string | number | readonly string[]
  'onChange'?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
  'onBlur'?: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement>
  'children'?: React.ReactNode
  'data-testid'?: string
}
