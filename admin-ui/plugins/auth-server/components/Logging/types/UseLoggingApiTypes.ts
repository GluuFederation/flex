import type { Logging } from 'JansConfigApi'
import type { ChangedFields } from './CommonTypes'

export interface UpdateLoggingParams {
  data: Logging
  userMessage: string
  changedFields: ChangedFields<Logging>
}
