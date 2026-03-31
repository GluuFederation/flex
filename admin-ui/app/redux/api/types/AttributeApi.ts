import type { JansAttribute } from 'JansConfigApi'

export interface IApi {
  getAttributes: (
    opts: AttributeOptions,
    callback: (error: Error | null, data?: AttributePagedResult) => void,
  ) => void
}

export interface AttributeOptions {
  limit?: number
  pattern?: string
  status?: string
  startIndex?: number
  sortBy?: string
  sortOrder?: 'ascending' | 'descending'
  fieldValuePair?: string
  [key: string]: string | number | boolean | undefined
}

export interface AttributePagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: JansAttribute[]
}
