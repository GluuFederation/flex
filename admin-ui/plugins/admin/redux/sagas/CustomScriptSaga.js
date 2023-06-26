import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  getCustomScriptsResponse,
  addCustomScriptResponse,
  editCustomScriptResponse,
  deleteCustomScriptResponse,
} from 'Plugins/admin/redux/features/customScriptSlice'
import { SCRIPT } from '../audit/Resources'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {updateToast} from 'Redux/features/toastSlice'
import ScriptApi from '../api/ScriptApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new ScriptApi(api)
}

export function* getCustomScripts({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCRIPT, payload)
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.getAllCustomScript, payload.action)
    yield put(getCustomScriptsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getCustomScriptsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* getScriptsByType({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCRIPT, payload)
    const scriptApi = yield* newFunction()
    const data = yield call(scriptApi.getScriptsByType, payload.action)
    yield put(getCustomScriptsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getCustomScriptsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* addScript({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, SCRIPT, payload)
    const scriptApi = yield* newFunction()
    const data = yield call(
      scriptApi.addCustomScript,
      payload.action.action_data,
    )
    yield put(addCustomScriptResponse({ data }))
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success'))
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(addCustomScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* editScript({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, SCRIPT, payload)
    const scriptApi = yield* newFunction()
    const data = yield call(
      scriptApi.editCustomScript,
      payload.action.action_data,
    )
    yield put(editCustomScriptResponse({ data }))
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success'))
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(editCustomScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteScript({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, SCRIPT, payload)
    const scriptApi = yield* newFunction()
    yield call(scriptApi.deleteCustomScript, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(deleteCustomScriptResponse({ inum: payload.action.action_data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(deleteCustomScriptResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetAllCustomScripts() {
  yield takeLatest('customScript/getCustomScripts', getCustomScripts)
}

export function* watchAddScript() {
  yield takeLatest('customScript/addCustomScript', addScript)
}

export function* watchEditScript() {
  yield takeLatest('customScript/editCustomScript', editScript)
}
export function* watchDeleteScript() {
  yield takeLatest('customScript/deleteCustomScript', deleteScript)
}
export function* watchScriptsByType() {
  yield takeLatest('customScript/getCustomScriptByType', getScriptsByType)
}
export default function* rootSaga() {
  yield all([
    fork(watchGetAllCustomScripts),
    fork(watchAddScript),
    fork(watchEditScript),
    fork(watchDeleteScript),
    fork(watchScriptsByType),
  ])
}
