import type { JsonPatch } from 'JansConfigApi'
import type { Accordion } from 'Components'
import type React from 'react'
import type { GenericItem } from '@/redux/types'
import type { FormikErrors, FormikTouched } from 'formik'
import type { AutocompleteOption } from '@/routes/Apps/Gluu/types/GluuAutocomplete.types'

export type AppConfiguration = {
  [key: string]: string | number | boolean | string[] | AppConfiguration | null | undefined
}

export type SchemaProperty = {
  type?: string
  items?: {
    type?: string
    enum?: string[]
  }
}

export type StringArrayFieldProps = {
  propKey: string
  label: string
  values: string[]
  options: AutocompleteOption[]
  path: string
  handler: (patch: JsonPatch) => void
  formResetKey: number
  allowCustom?: boolean
}

export type ArrayItemSelectProps = {
  index: number
  values: string[]
  options: AutocompleteOption[]
  label: string
  path: string
  handler: (patch: JsonPatch) => void
  formResetKey: number
  allowCustom?: boolean
}

export type PropertyValue =
  | string
  | number
  | boolean
  | string[]
  | AppConfiguration
  | null
  | undefined

export type JsonPropertyBuilderProps = {
  propKey: string
  propValue?: PropertyValue
  lSize: number
  path?: string
  handler: (patch: JsonPatch) => void
  parentIsArray?: boolean
  schema?: SchemaProperty
  isRenamedKey?: boolean
  errors?: FormikErrors<AppConfiguration>
  touched?: FormikTouched<AppConfiguration>
  formResetKey?: number
}

type DefaultAcrInputOption = {
  value: string
  label: string
}

export type DefaultAcrInputProps = {
  label: string
  name: string
  value?: string
  required?: boolean
  lsize?: number
  rsize?: number
  isArray?: boolean
  handler: (put: AcrPutOperation) => void
  options: (string | DefaultAcrInputOption)[]
  path: string
  showSaveButtons?: boolean
}

export type AcrPutOperation = {
  path: string
  value: string
  op: 'replace'
}

export type Script = GenericItem & {
  name: string
  scriptType: string
  enabled: boolean
}

export type SimpleFieldModel = {
  propKey: string
  label: string
  value: string | number | boolean | string[]
  isBoolean: boolean
  isArray: boolean
  options?: string[]
}

export type AccordionWithSubComponents = typeof Accordion & {
  Header: React.ComponentType<React.PropsWithChildren<{ style?: React.CSSProperties }>>
  Body: React.ComponentType<React.PropsWithChildren>
}

export type { JsonPatch }
