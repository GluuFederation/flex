import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
import { AssetApiClient, AssetBody } from './types/AssetApiTypes'

export default class AssetApi {
  private readonly api: AssetApiClient

  constructor(api: AssetApiClient) {
    this.api = api
  }

  getAllJansAssets = (opts: Record<string, unknown>): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAllAssets(opts, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getAssetServices = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetServices((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getAssetTypes = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetTypes((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  createJansAsset = (body: AssetBody, token: string): Promise<unknown> => {
    const document = {
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
        .catch((error) => handleResponse(error, reject, resolve, null, null))
    })
  }

  updateJansAsset = (body: AssetBody, token: string): Promise<unknown> => {
    const document = {
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
        .catch((error) => handleResponse(error, reject, resolve, null, null))
    })
  }

  deleteJansAssetByInum = (id: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.deleteAsset(id, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getJansAssetByInum = (id: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetByInum(id, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  getJansAssetByName = (name: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getAssetByName(name, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  private buildFormData(body: AssetBody, document: Record<string, unknown>): FormData {
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
