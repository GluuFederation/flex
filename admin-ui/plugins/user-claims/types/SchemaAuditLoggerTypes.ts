import type { JansAttribute } from 'JansConfigApi'
import type { ModifiedFields } from '../components/types'

export type SchemaAuditLogParams = {
  action: string
  resource: string
  message: string
  payload?: Partial<JansAttribute>
  modifiedFields?: ModifiedFields
}
