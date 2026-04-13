import type { FormikProps } from 'formik'
import type { JsonValue } from './common'

export type TypeAheadOptionObject = {
  dn?: string
  key?: string
  name?: string
  customOption?: boolean
  label?: string
}

export type TypeAheadOption = string | TypeAheadOptionObject

export type GluuTypeAheadForDnProps<
  TValues extends object = Record<string, JsonValue>,
  TOption extends TypeAheadOptionObject = TypeAheadOptionObject,
> = {
  label: string
  name: string
  value?: TOption[]
  options: TOption[]
  formik: FormikProps<TValues>
  required?: boolean
  doc_category?: string
  doc_entry?: string
  disabled?: boolean
  allowNew?: boolean
  haveLabelKey?: boolean
  lsize?: number
  rsize?: number
  paginate?: boolean
  onSearch?: (query: string) => void
  onPaginate?: (e: React.SyntheticEvent, shownResults: number) => void
  maxResults?: number
  isLoading?: boolean
  placeholder?: string
  onChange?: (selected: TOption[]) => void
  hideHelperMessage?: boolean
  defaultSelected?: TOption[]
}
