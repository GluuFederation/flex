import type { DynamicConfigFormValues, StaticConfigFormValues } from './fido'

export type UpdateFidoParams = {
  data: DynamicConfigFormValues | StaticConfigFormValues
  type: string
  userMessage?: string
}
