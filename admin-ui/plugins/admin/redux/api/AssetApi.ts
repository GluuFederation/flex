import { handleTypedResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
import { Document, AssetFormData } from '../../components/Assets/types/AssetApiTypes'

export default class AssetApi {
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
        .then((result) => handleTypedResponse(null, reject, resolve, result?.data))
        .catch((error) => handleTypedResponse<Document>(error, reject, resolve, undefined))
    })
  }

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
        .then((result) => handleTypedResponse(null, reject, resolve, result?.data))
        .catch((error) => handleTypedResponse<Document>(error, reject, resolve, undefined))
    })
  }

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
