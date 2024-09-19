import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
export default class AssetApi {
    constructor(api) {
        this.api = api
    }

    getAllJansAssets = (opts) => {
        return new Promise((resolve, reject) => {
            this.api.getAllAssets(opts, (error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }

    getAssetServices = () => {
        return new Promise((resolve, reject) => {
            this.api.getAssetServices((error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }

    getAssetTypes = () => {
        return new Promise((resolve, reject) => {
            this.api.getAssetTypes((error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }


    createJansAsset = (body, token) => {
        const document = {
            "fileName": body.fileName, "description": body.description,
            "document": body.fileName, "service": body?.service || [], "enabled": body.enabled
        }
        const formData = this.buildFormData(body, document)
        return new Promise((resolve, reject) => {
            axios.postForm('/api/v1/jans-assets/upload', formData, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => handleResponse(undefined, reject, resolve, result))
                .catch(error => handleResponse(error, reject, resolve, undefined));
        })
    }

    updateJansAsset = (body, token) => {
        const document = {
            "fileName": body.fileName, "description": body.description, "inum": body.inum,
            "dn": body.dn, "baseDn": body.baseDn,
            "document": body.fileName, "service": body?.service || [], "enabled": body.enabled
        }
        const formData = this.buildFormData(body, document)
        return new Promise((resolve, reject) => {
            axios.putForm('/api/v1/jans-assets/upload', formData, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => handleResponse(undefined, reject, resolve, result))
                .catch(error => handleResponse(error, reject, resolve, undefined));
        })
    }

    deleteJansAssetByInum = (id) => {
        return new Promise((resolve, reject) => {
            this.api.deleteAsset(id, (error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }

    getJansAssetByInum = (id) => {
        return new Promise((resolve, reject) => {
            this.api.getAssetByInum(id, (error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }

    getJansAssetByName = (name) => {
        return new Promise((resolve, reject) => {
            this.api.getAssetByName(name, (error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }

    buildFormData(body, document) {
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
            }
        )
        formData.append('document', documentBlob)
        formData.append('assetFile', assetFileBlob)
        return formData
    }
}