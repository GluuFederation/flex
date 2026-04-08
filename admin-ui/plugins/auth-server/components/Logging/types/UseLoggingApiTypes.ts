import type { Logging } from 'JansConfigApi'
import type { ChangedFields } from './CommonTypes'

export type UpdateLoggingParams = {
  data: Logging
  userMessage: string
  changedFields: ChangedFields<Logging>
}
