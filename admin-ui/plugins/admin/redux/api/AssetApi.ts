import { handleResponse, handleTypedResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
import {
  Document,
  DocumentPagedResult,
  PagedResult,
  AssetDirMapping,
  AssetFormData,
  IJansAssetsApi,
} from '../../components/Assets/types/AssetApiTypes'

export default class AssetApi {
  private readonly api: IJansAssetsApi

  constructor(api: IJansAssetsApi) {
    this.api = api
  }

  /**
   * Get asset directory mappings
   */
  getAssetDirMapping = (): Promise<AssetDirMapping[]> => {
    return new Promise<AssetDirMapping[]>((resolve, reject) => {
      this.api.getAssetDirMapping((error: Error | null, data?: AssetDirMapping[]) => {
        handleTypedResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  /**
   * Create new Jans asset - compatible with saga usage
   */
  createJansAsset = (body: AssetFormData): Promise<Document> => {
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
          withCredentials: true,
        })
        .then((result) => handleTypedResponse(null, reject, resolve, result?.data, undefined))
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  /**
   * Update existing Jans asset - compatible with saga usage
   */
  updateJansAsset = (body: AssetFormData): Promise<Document> => {
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
          withCredentials: true,
        })
        .then((result) => handleTypedResponse(null, reject, resolve, result?.data, undefined))
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }

  /**
   * Get Jans asset by inum
   */
  getJansAssetByInum = (inum: string): Promise<PagedResult> => {
    return new Promise<PagedResult>((resolve, reject) => {
      this.api.getAssetByInum(inum, (error: Error | null, data?: PagedResult) => {
        handleTypedResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  /**
   * Get Jans asset by name
   */
  getJansAssetByName = (name: string): Promise<DocumentPagedResult> => {
    return new Promise<DocumentPagedResult>((resolve, reject) => {
      this.api.getAssetByName(name, (error: Error | null, data?: DocumentPagedResult) => {
        handleTypedResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  /**
   * Load service asset
   */
  loadServiceAsset = (serviceName: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      this.api.loadServiceAsset(serviceName, (error: Error | null, data?: string) => {
        handleTypedResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  /**
   * Build form data for asset upload/update
   */
  private buildFormData(body: AssetFormData, document: Document): FormData {
    const formData = new FormData()
    const assetFile: Blob | File =
      body.document instanceof File
        ? body.document
        : body.document instanceof Blob
          ? body.document
          : new Blob([body.document as BlobPart], { type: 'application/octet-stream' })
    const documentBlob = new Blob([JSON.stringify({ ...document })], {
      type: 'application/json',
    })
    formData.append('document', documentBlob)
    formData.append('assetFile', assetFile)
    return formData
  }
}
