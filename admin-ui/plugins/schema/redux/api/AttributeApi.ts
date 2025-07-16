import { handleResponse } from 'Utils/ApiUtils'

interface AttributeValidation {
  regexp?: string | null
  minLength?: number | null
  maxLength?: number | null
}

interface AttributeItem {
  inum?: string
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  jansHideOnDiscovery: boolean
  oxMultiValuedAttribute: boolean
  attributeValidation: AttributeValidation
  scimCustomAttr: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
}

interface AttributeApiClient {
  getAttributes: (opts: any, callback: (error: any, data: any) => void) => void
  postAttributes: (options: any, callback: (error: any, data: any) => void) => void
  putAttributes: (options: any, callback: (error: any, data: any) => void) => void
  deleteAttributesByInum: (inum: string, callback: (error: any, data: any) => void) => void
}

interface AttributeOptions {
  [key: string]: any
}

interface AttributePostOptions {
  jansAttribute: AttributeItem
}

export default class AttributeApi {
  private readonly api: AttributeApiClient

  constructor(api: AttributeApiClient) {
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

  // search attributes
  searchAttributes = (opts: AttributeOptions): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(opts, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  addNewAttribute = (data: AttributeItem): Promise<any> => {
    const options: AttributePostOptions = {
      jansAttribute: data,
    }
    return new Promise((resolve, reject) => {
      this.api.postAttributes(options, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  editAnAttribute = (data: AttributeItem): Promise<any> => {
    const options: AttributePostOptions = {
      jansAttribute: data,
    }
    return new Promise((resolve, reject) => {
      this.api.putAttributes(options, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  deleteAnAttribute = (inum: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.deleteAttributesByInum(inum, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}
