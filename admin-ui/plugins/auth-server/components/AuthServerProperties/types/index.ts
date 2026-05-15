import type { JsonPatch } from 'JansConfigApi'
import type { Accordion } from 'Components'
import type React from 'react'
import type { GenericItem } from '@/redux/types'
import type { FormikErrors, FormikTouched } from 'formik'
import { MultiSelectOption } from '@/routes/Apps/Gluu/types/GluuMultiSelectRow.types'

export interface AppConfiguration {
  [key: string]: string | number | boolean | string[] | AppConfiguration | null | undefined
}

export interface SchemaProperty {
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
  options: MultiSelectOption[]
  path: string
  handler: (patch: JsonPatch) => void
  lSize: number
  formResetKey: number
}

export type ArrayItemSelectProps = {
  index: number
  values: string[]
  options: MultiSelectOption[]
  label: string
  path: string
  handler: (patch: JsonPatch) => void
  formResetKey: number
}

export type PropertyValue =
  | string
  | number
  | boolean
  | string[]
  | AppConfiguration
  | null
  | undefined

export interface JsonPropertyBuilderProps {
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

interface DefaultAcrInputOption {
  value: string
  label: string
}

export interface DefaultAcrInputProps {
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

export interface AcrPutOperation {
  path: string
  value: string
  op: 'replace'
}

export interface Script extends GenericItem {
  name: string
  scriptType: string
  enabled: boolean
}

export interface SimpleFieldModel {
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
