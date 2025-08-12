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
  [key: string]: unknown
}

export interface AttributePagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: unknown[]
}
