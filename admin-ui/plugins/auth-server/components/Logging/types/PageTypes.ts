import type { Logging } from 'JansConfigApi'
import type { ChangedFields } from './CommonTypes'

export type PendingValues = {
  mergedValues: Logging
  changedFields: ChangedFields<Logging>
}
