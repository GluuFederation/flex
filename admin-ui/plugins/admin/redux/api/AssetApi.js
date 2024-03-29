import { handleResponse } from 'Utils/ApiUtils'

export default class AssetApi {
    constructor(api) {
        this.api = api
    }

    getAllJansAssets = (opts) => {
        console.log("==============get all")
        return new Promise((resolve, reject) => {
            this.api.getAllAssets(opts, (error, data) => {
                handleResponse(error, reject, resolve, data)
            })
        })
    }

    createJansAsset = (body) => {
        return new Promise((resolve, reject) => {
            this.api.postNewAsset(document, assetfile, (error, data) => {
                handleResponse(error, reject, resolve, data)
            })
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