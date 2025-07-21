import { handleResponse } from 'Utils/ApiUtils'
import { IAttributeApi, AttributeOptions } from './types/attribute'

export default class AttributeApi {
  private readonly api: IAttributeApi

  constructor(api: IAttributeApi) {
    this.api = api
  }

  // Get all attributes
  getAllAttributes = (opts: AttributeOptions): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(opts, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
