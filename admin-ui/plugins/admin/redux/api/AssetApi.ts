import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
import {
  Document,
  DocumentPagedResult,
  PagedResult,
  AssetDirMapping,
  GetAllAssetsOptions,
  AssetFormData,
  IJansAssetsApi,
} from '../../components/Assets/types/AssetApiTypes'

export default class AssetApi {
  private readonly api: IJansAssetsApi

  constructor(api: IJansAssetsApi) {
    this.api = api
  }

  /**
   * Get all Jans assets - compatible with saga usage
   */
  getAllJansAssets = (opts?: GetAllAssetsOptions): Promise<DocumentPagedResult> => {
    return new Promise<DocumentPagedResult>((resolve, reject) => {
      this.api.getAllAssets(opts || {}, (error: Error | null, data?: DocumentPagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get asset services - compatible with saga usage
   */
  getAssetServices = (): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
      this.api.getAssetServices((error: Error | null, data?: string[]) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get asset types - compatible with saga usage
   */
  getAssetTypes = (): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
      this.api.getAssetTypes((error: Error | null, data?: string[]) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get asset directory mappings
   */
  getAssetDirMapping = (): Promise<AssetDirMapping[]> => {
    return new Promise<AssetDirMapping[]>((resolve, reject) => {
      this.api.getAssetDirMapping((error: Error | null, data?: AssetDirMapping[]) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Create new Jans asset - compatible with saga usage
   */
  createJansAsset = (body: AssetFormData, token: string): Promise<Document> => {
    const document: Document = {
      fileName: body.fileName,
      description: body.description,
      document: body.fileName,
      service: body?.service,
      enabled: body.enabled,
    }
    const formData = this.buildFormData(body, document)

    return new Promise<Document>((resolve, reject) => {
      axios
        .postForm('/api/v1/jans-assets/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => handleResponse(null, reject, resolve as (data: unknown) => void, result))
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  /**
   * Update existing Jans asset - compatible with saga usage
   */
  updateJansAsset = (body: AssetFormData, token: string): Promise<Document> => {
    const document: Document = {
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

    return new Promise<Document>((resolve, reject) => {
      axios
        .putForm('/api/v1/jans-assets/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => handleResponse(null, reject, resolve as (data: unknown) => void, result))
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  /**
   * Delete Jans asset by inum - compatible with saga usage
   */
  deleteJansAssetByInum = (inum: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.api.deleteAsset(inum, (error: Error | null, data?: unknown) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get Jans asset by inum
   */
  getJansAssetByInum = (inum: string): Promise<PagedResult> => {
    return new Promise<PagedResult>((resolve, reject) => {
      this.api.getAssetByInum(inum, (error: Error | null, data?: PagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get Jans asset by name
   */
  getJansAssetByName = (name: string): Promise<DocumentPagedResult> => {
    return new Promise<DocumentPagedResult>((resolve, reject) => {
      this.api.getAssetByName(name, (error: Error | null, data?: DocumentPagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Load service asset
   */
  loadServiceAsset = (serviceName: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      this.api.loadServiceAsset(serviceName, (error: Error | null, data?: string) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Build form data for asset upload/update
   */
  private buildFormData(body: AssetFormData, document: Document): FormData {
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
