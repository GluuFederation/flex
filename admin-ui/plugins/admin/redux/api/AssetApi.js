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

    createJansAsset = (body, token) => {
        const document = {
            "displayName": body.displayName, "description": body.description,
            "document": body.displayName, "jansModuleProperty": [], "jansEnabled": body.jansEnabled
        }
        const formData = new FormData();
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
        formData.append('document', documentBlob);
        formData.append('assetFile', assetFileBlob);
        return new Promise((resolve, reject) => {
            axios.postForm('/api/v1/jans-assets/upload', formData, { headers: { Authorization: `Bearer ${token}` } })
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

    updateJansAsset = (body) => {
        return new Promise((resolve, reject) => {
            this.api.putAsset(document, assetfile, (error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }
}