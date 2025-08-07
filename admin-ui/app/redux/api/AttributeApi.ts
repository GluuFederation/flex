import { handleResponse } from 'Utils/ApiUtils'

interface IApi {
  getAttributes: (
    opts: AttributeOptions,
    callback: (error: Error | null, data?: AttributePagedResult) => void,
  ) => void
}

interface AttributeOptions {
  limit?: number
  pattern?: string
  status?: string
  startIndex?: number
  sortBy?: string
  sortOrder?: 'ascending' | 'descending'
  fieldValuePair?: string
  [key: string]: unknown
}

interface AttributePagedResult {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: unknown[]
}

export default class AttributeApi {
  private readonly api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  // Get all attributes
  getAllAttributes = (opts: AttributeOptions): Promise<AttributePagedResult> => {
    return new Promise<AttributePagedResult>((resolve, reject) => {
      this.api.getAttributes(opts, (error: Error | null, data?: AttributePagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data, null)
      })
    })
  }
}
