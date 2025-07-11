import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  fetchJansAssets,
  getJansAssetResponse,
  getAssetServicesResponse,
  getAssetTypesResponse,
  createJansAssetResponse,
  deleteJansAssetResponse,
  updateJansAssetResponse,
} from 'Plugins/admin/redux/features/AssetSlice'
import { CREATE, FETCH, DELETION, UPDATE } from '../../../../app/audit/UserActionType'
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
  const api = new JansConfigApi.JansAssetsApi(getClient(JansConfigApi, token, issuer))
  return new AssetApi(api)
}

export function* getAllJansAssets({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'asset', payload)
    const assetApi = yield* newFunction()
    const data = yield call(assetApi.getAllJansAssets, payload.action)
    yield put(getJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
    yield put(getJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getAssetServices({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetServices', payload)
    const assetApi = yield* newFunction()
    const data = yield call(assetApi.getAssetServices, payload.action)
    yield put(getAssetServicesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
    yield put(getAssetServicesResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getAssetTypes({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetTypes', payload)
    const assetApi = yield* newFunction()
    const data = yield call(assetApi.getAssetTypes, payload.action)
    yield put(getAssetTypesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
    yield put(getAssetTypesResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* createJansAsset({ payload }) {
  const audit = yield* initAudit()
  try {
    const token = yield select((state) => state.authReducer.token.access_token)
    addAdditionalData(audit, CREATE, 'asset', payload)
    const assetApi = yield* newFunction()
    const data = yield call(assetApi.createJansAsset, payload.action.action_data, token)
    yield put(createJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
    yield put(createJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteJansAsset({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'asset', payload)
    const assetApi = yield* newFunction()
    const data = yield call(assetApi.deleteJansAssetByInum, payload.action.action_data.inum)
    yield put(deleteJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    yield put(fetchJansAssets())
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
    yield put(deleteJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* updateJansAsset({ payload }) {
  const token = yield select((state) => state.authReducer.token.access_token)
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'asset', payload)
    const assetApi = yield* newFunction()
    const data = yield call(assetApi.updateJansAsset, payload.action.action_data, token)
    yield put(updateJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    yield put(fetchJansAssets())
    return data
  } catch (e) {
    yield put(updateToast(true, 'error', e?.response?.body?.responseMessage || e.message))
    yield put(updateJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchFetchJansAssets() {
  yield takeLatest('asset/fetchJansAssets', getAllJansAssets)
}

export function* watchGetAssetTypes() {
  yield takeLatest('asset/getAssetTypes', getAssetTypes)
}

export function* watchGetAssetServices() {
  yield takeLatest('asset/getAssetServices', getAssetServices)
}

export function* watchCreateJansAsset() {
  yield takeLatest('asset/createJansAsset', createJansAsset)
}

export function* watchDeleteJansAsset() {
  yield takeLatest('asset/deleteJansAsset', deleteJansAsset)
}

export function* watchUpdateJansAsset() {
  yield takeLatest('asset/updateJansAsset', updateJansAsset)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAssetServices),
    fork(watchGetAssetTypes),
    fork(watchFetchJansAssets),
    fork(watchCreateJansAsset),
    fork(watchDeleteJansAsset),
    fork(watchUpdateJansAsset),
  ])
}
