import { handleResponse } from 'Utils/ApiUtils'
import { IApi, AttributeOptions, AttributePagedResult } from './types/AttributeApi'

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
