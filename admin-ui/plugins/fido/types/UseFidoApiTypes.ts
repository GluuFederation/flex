import type { DynamicConfigFormValues, StaticConfigFormValues } from './fido'

export type UpdateFidoParams =
  | { type: 'static'; data: StaticConfigFormValues; userMessage?: string }
  | { type: 'dynamic'; data: DynamicConfigFormValues; userMessage?: string }
