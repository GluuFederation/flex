import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'

// Type definitions
interface IAssetApi {
  getAllAssets: (opts: AssetOptions, callback: (error: any, data: any) => void) => void
  getAssetServices: (callback: (error: any, data: any) => void) => void
  getAssetTypes: (callback: (error: any, data: any) => void) => void
  deleteAsset: (id: string, callback: (error: any, data: any) => void) => void
  getAssetByInum: (id: string, callback: (error: any, data: any) => void) => void
  getAssetByName: (name: string, callback: (error: any, data: any) => void) => void
}

interface AssetOptions {
  limit?: number
  pattern?: string | null
  startIndex?: number
  [key: string]: any
}

interface AssetBody {
  fileName: string
  description: string
  document: File | ArrayBuffer
  service?: string
  enabled: boolean
  inum?: string
  dn?: string
  baseDn?: string
}

interface AssetDocument {
  fileName: string
  description: string
  document: string
  service?: string
  enabled: boolean
  inum?: string
  dn?: string
  baseDn?: string
}

export default class AssetApi {
  private readonly api: IAssetApi

  constructor(api: IAssetApi) {
    this.api = api
  }

  getAllJansAssets = (opts: AssetOptions): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAllAssets(opts, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getAssetServices = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetServices((error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getAssetTypes = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetTypes((error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  createJansAsset = (body: AssetBody, token: string): Promise<any> => {
    const document: AssetDocument = {
      fileName: body.fileName,
      description: body.description,
      document: body.fileName,
      service: body?.service,
      enabled: body.enabled,
    }
    const formData = this.buildFormData(body, document)
    return new Promise((resolve, reject) => {
      axios
        .postForm('/api/v1/jans-assets/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => handleResponse(null, reject, resolve, result, null))
        .catch((error) => handleResponse(error, reject, resolve, undefined, null))
    })
  }

  updateJansAsset = (body: AssetBody, token: string): Promise<any> => {
    const document: AssetDocument = {
      fileName: body.fileName,
      description: body.description,
      inum: body.inum,
      dn: body.dn,
      baseDn: body.baseDn,
      document: body.fileName,
      service: body?.service,
      enabled: body.enabled,
    }
    const formData = this.buildFormData(body, document)
    return new Promise((resolve, reject) => {
      axios
        .putForm('/api/v1/jans-assets/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => handleResponse(null, reject, resolve, result, null))
        .catch((error) => handleResponse(error, reject, resolve, undefined, null))
    })
  }

  deleteJansAssetByInum = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.deleteAsset(id, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getJansAssetByInum = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetByInum(id, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getJansAssetByName = (name: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetByName(name, (error: any, data: any) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  private buildFormData(body: AssetBody, document: AssetDocument): FormData {
    const formData = new FormData()
    const assetFileBlob = new Blob([body.document], {
      type: 'application/octet-stream',
    })
    const documentBlob = new Blob(
      [
        JSON.stringify({
          ...document,
        }),
      ],
      {
        type: 'application/json',
      },
    )
    formData.append('document', documentBlob)
    formData.append('assetFile', assetFileBlob)
    return formData
  }
}
