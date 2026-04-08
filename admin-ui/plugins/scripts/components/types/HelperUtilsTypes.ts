import type { SimpleCustomProperty } from 'JansConfigApi'
import type { ApiError as BaseApiError } from '@/utils/types'
import type { ConfigurationProperty, ModuleProperty } from './customScript'

export type ApiError = BaseApiError<string | { message?: string }>

export type PropertyInput =
  | ConfigurationProperty
  | ModuleProperty
  | SimpleCustomProperty
  | Record<string, string | boolean | undefined>

export type PropertyLike = { key?: string; value?: string; value1?: string; value2?: string }
