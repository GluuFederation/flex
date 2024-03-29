import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
    getAssets,
    getAssetResponse,
    createAssetResponse,
    deleteAssetResponse,
    updateAssetResponse,
} from 'Plugins/admin/redux/features/assetSlice'
import {
    CREATE,
    FETCH,
    DELETION,
    UPDATE,
} from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import AssetApi from '../api/AssetApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
    const token = yield select((state) => state.authReducer.token.access_token)
    const issuer = yield select((state) => state.authReducer.issuer)
    const api = new JansConfigApi.JansAssetsApi(
        getClient(JansConfigApi, token, issuer)
    )
    return new AssetApi(api)
}

export function* getAllAssets({ payload }) {
    console.log("=====================", payload)
    const audit = yield* initAudit()
    try {
        payload = payload || { action: {} }
        addAdditionalData(audit, FETCH, 'asset', payload)
        const assetApi = yield* newFunction()
        const data = yield call(assetApi.getAllJansAssets, payload.action)
        yield put(getAssetResponse({ data }))
        yield call(postUserAction, audit)
        return data
    } catch (e) {
        yield put(
            updateToast(
                true,
                'error',
                e?.response?.body?.responseMessage || e.message
            )
        )
        yield put(getAssetResponse({ data: null }))
        if (isFourZeroOneError(e)) {
            const jwt = yield select((state) => state.authReducer.userinfo_jwt)
            yield put(getAPIAccessToken(jwt))
        }
        return e
    }
}

export function* createAsset({ payload }) {
    const audit = yield* initAudit()
    try {
        addAdditionalData(audit, CREATE, 'asset', payload)
        const assetApi = yield* newFunction()
        const data = yield call(
            assetApi.createJansAsset,
            payload.action.action_data
        )
        yield put(createAssetResponse({ data }))
        yield call(postUserAction, audit)
        return data
    } catch (e) {
        yield put(
            updateToast(
                true,
                'error',
                e?.response?.body?.responseMessage || e.message
            )
        )
        yield put(createAssetResponse({ data: null }))
        if (isFourZeroOneError(e)) {
            const jwt = yield select((state) => state.authReducer.userinfo_jwt)
            yield put(getAPIAccessToken(jwt))
        }
        return e
    }
}

export function* deleteAsset({ payload }) {
    const audit = yield* initAudit()
    try {
        addAdditionalData(audit, DELETION, 'asset', payload)
        const assetApi = yield* newFunction()
        const data = yield call(
            assetApi.deleteJansAssetByInum,
            payload.action.action_data.inum
        )
        yield put(deleteAssetResponse({ data }))
        yield call(postUserAction, audit)
        yield put(getAssets())
        return data
    } catch (e) {
        yield put(
            updateToast(
                true,
                'error',
                e?.response?.body?.responseMessage || e.message
            )
        )
        yield put(deleteAssetResponse({ data: null }))
        if (isFourZeroOneError(e)) {
            const jwt = yield select((state) => state.authReducer.userinfo_jwt)
            yield put(getAPIAccessToken(jwt))
        }
        return e
    }
}

export function* updateAsset({ payload }) {
    const audit = yield* initAudit()
    try {
        addAdditionalData(audit, UPDATE, 'asset', payload)
        const assetApi = yield* newFunction()
        const data = yield call(
            assetApi.updateJansAsset,
            payload.action.action_data
        )
        yield put(updateAssetResponse({ data }))
        yield call(postUserAction, audit)
        yield put(getAssets())
        return data
    } catch (e) {
        yield put(
            updateToast(
                true,
                'error',
                e?.response?.body?.responseMessage || e.message
            )
        )
        yield put(updateAssetResponse({ data: null }))
        if (isFourZeroOneError(e)) {
            const jwt = yield select((state) => state.authReducer.userinfo_jwt)
            yield put(getAPIAccessToken(jwt))
        }
        return e
    }
}

export function* watchGetAllAssets() {
    yield takeLatest('asset/getAssets', getAllAssets)
}

export function* watchCreateAsset() {
    yield takeLatest('asset/createAsset', createAsset)
}

export function* watchDeleteAsset() {
    yield takeLatest('asset/deleteAsset', deleteAsset)
}

export function* watchUpdateAsset() {
    yield takeLatest('asset/updateAsset', updateAsset)
}



export default function* rootSaga() {
    yield all([
        fork(watchGetAllAssets),
        fork(watchCreateAsset),
        fork(watchDeleteAsset),
        fork(watchUpdateAsset),
    ])
}
