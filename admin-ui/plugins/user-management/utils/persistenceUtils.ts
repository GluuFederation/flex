import type { PersistenceInfo } from '../types'

export const isPersistenceInfo = (
  data: Partial<PersistenceInfo> | null | undefined,
): data is PersistenceInfo => {
  if (data === null || data === undefined || Array.isArray(data)) {
    return false
  }
  return typeof data.persistenceType === 'string'
}
