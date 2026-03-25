import { handleTypedResponse } from 'Utils/ApiUtils'
import { IApi, AttributeOptions, AttributePagedResult } from './types/AttributeApi'

export default class AttributeApi {
  private readonly api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  getAllAttributes = (opts: AttributeOptions): Promise<AttributePagedResult> => {
    return new Promise<AttributePagedResult>((resolve, reject) => {
      this.api.getAttributes(opts, (error, data) => {
        handleTypedResponse(error, reject, resolve, data ?? { entries: [] }, null)
      })
    })
  }
}
