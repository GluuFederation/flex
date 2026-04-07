import type { SimpleCustomProperty } from 'JansConfigApi'
import type { ConfigurationProperty, ModuleProperty } from './customScript'

export interface ApiError {
  response?: { data?: string | { message?: string } }
  message?: string
}

export type PropertyInput =
  | ConfigurationProperty
  | ModuleProperty
  | SimpleCustomProperty
  | Record<string, string | boolean | undefined>

export type PropertyLike = { key?: string; value?: string; value1?: string; value2?: string }
