import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  getCustomScriptsResponse,
  addCustomScriptResponse,
  editCustomScriptResponse,
  deleteCustomScriptResponse,
  setScriptTypes,
  setIsScriptTypesLoading,
} from 'Plugins/admin/redux/features/customScriptSlice'
import { SCRIPT } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { updateToast } from 'Redux/features/toastSlice'
import ScriptApi from '../api/ScriptApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'

// Define interfaces
interface CustomScript {
  inum?: string
  name: string
  description?: string
  scriptType: string
  programmingLanguage: string
  level: number
  script?: string
  aliases?: string[]
  moduleProperties?: any[]
  configurationProperties?: any[]
  enabled: boolean
  locationType?: string
  locationPath?: string
  scriptError?: {
    stackTrace: string
  }
  revision?: number
  internal?: boolean
  [key: string]: any
}

interface ScriptType {
  value: string
  name: string
}

interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: any
}

interface ActionPayload {
  action: UserAction
}

interface AuditLog {
  headers: Record<string, string>
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: {
    user_inum: string
    userId: string
  }
  action?: string
  resource?: string
  message?: string
  modifiedFields?: any
  performedOn?: any
  payload?: any
  date?: Date
}

interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  customScriptReducer: {
    items: CustomScript[]
    loading: boolean
    view: boolean
    saveOperationFlag: boolean
    errorInSaveOperationFlag: boolean
    totalItems: number
    entriesCount: number
    scriptTypes: ScriptType[]
    hasFetchedScriptTypes: boolean
    loadingScriptTypes: boolean
    item?: CustomScript
  }
}

function* newFunction(): any {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(getClient(JansConfigApi, token, issuer))
  return new ScriptApi(api)
}

export function* getCustomScripts({ payload }: { payload: ActionPayload }): any {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, SCRIPT, payload)
    const scriptApi: ScriptApi = yield call(newFunction)
    const data: any = yield call(scriptApi.getAllCustomScript, payload.action)
    yield put(getCustomScriptsResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e: any) {
    yield put(getCustomScriptsResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getScriptsByType({ payload }: { payload: ActionPayload }): any {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, SCRIPT, payload)
    const scriptApi: ScriptApi = yield call(newFunction)
    const data: any = yield call(scriptApi.getScriptsByType, payload.action)
    yield put(getCustomScriptsResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    yield put(getCustomScriptsResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* addScript({ payload }: { payload: ActionPayload }): any {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, CREATE, SCRIPT, payload)
    const scriptApi: ScriptApi = yield call(newFunction)
    const data: any = yield call(scriptApi.addCustomScript, payload.action.action_data)
    yield call(triggerWebhook, { payload: { createdFeatureValue: data } })
    yield put(addCustomScriptResponse({ data }))
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success'))
    return data
  } catch (e: any) {
    console.log('error', e)
    yield put(updateToast(true, 'error'))
    yield put(addCustomScriptResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editScript({ payload }: { payload: ActionPayload }): any {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, UPDATE, SCRIPT, payload)
    const scriptApi: ScriptApi = yield call(newFunction)
    const data: any = yield call(scriptApi.editCustomScript, payload.action.action_data)
    yield put(editCustomScriptResponse({ data }))
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success'))
    yield call(triggerWebhook, { payload: { createdFeatureValue: data } })
    return data
  } catch (e: any) {
    console.log('error', e)
    yield put(updateToast(true, 'error'))
    yield put(editCustomScriptResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteScript({ payload }: { payload: ActionPayload }): any {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, DELETION, SCRIPT, payload)
    const scriptApi: ScriptApi = yield call(newFunction)
    const data: any = yield call(scriptApi.deleteCustomScript, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(deleteCustomScriptResponse({ inum: payload.action.action_data }))
    yield call(triggerWebhook, {
      payload: { createdFeatureValue: { inum: payload.action.action_data } },
    })
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    yield put(updateToast(true, 'error'))
    yield put(deleteCustomScriptResponse({}))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getScriptTypes(): any {
  yield put(setIsScriptTypesLoading(true))
  try {
    const scriptApi: ScriptApi = yield call(newFunction)
    const data: string[] = yield call(scriptApi.getCustomScriptTypes)

    const types: ScriptType[] = data.map((type: string) => {
      if (type?.includes('_')) {
        const splitFormat: string[] = type?.split('_')
        const formattedTypes: string[] = splitFormat?.map(
          (formattedType: string) =>
            formattedType?.charAt(0)?.toUpperCase() + formattedType?.slice(1),
        )
        return { value: type, name: formattedTypes?.join(' ') }
      }

      return { value: type, name: type?.charAt(0)?.toUpperCase() + type?.slice(1) }
    })
    yield put(setScriptTypes(types || []))
  } catch (e: any) {
    console.log('error in getting script-types: ', e)
    yield put(setScriptTypes([]))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  } finally {
    yield put(setIsScriptTypesLoading(false))
  }
}

export function* watchGetAllCustomScripts(): any {
  yield takeLatest('customScript/getCustomScripts' as any, getCustomScripts)
}

export function* watchAddScript(): any {
  yield takeLatest('customScript/addCustomScript' as any, addScript)
}

export function* watchEditScript(): any {
  yield takeLatest('customScript/editCustomScript' as any, editScript)
}

export function* watchDeleteScript(): any {
  yield takeLatest('customScript/deleteCustomScript' as any, deleteScript)
}

export function* watchScriptsByType(): any {
  yield takeLatest('customScript/getCustomScriptByType' as any, getScriptsByType)
}

export function* watchGetScriptTypes(): any {
  yield takeLatest('customScript/getScriptTypes' as any, getScriptTypes)
}

export default function* rootSaga(): any {
  yield all([
    fork(watchGetAllCustomScripts),
    fork(watchAddScript),
    fork(watchEditScript),
    fork(watchDeleteScript),
    fork(watchScriptsByType),
    fork(watchGetScriptTypes),
  ])
}
