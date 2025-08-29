import { call, all, put, fork, takeLatest, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { getAPIAccessToken } from '../../../../app/redux/features/authSlice'
import { isFourZeroOneError } from '../../../../app/utils/TokenController'
import { getClient } from '../../../../app/redux/api/base'
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
import { updateToast } from '../../../../app/redux/features/toastSlice'
import { postUserAction } from '../../../../app/redux/api/backend-api'
import FidoApi from '../api/FidoApi'
import {
  deleteFido2DeviceDataResponse,
  getFidoConfiguration,
  getFidoConfigurationResponse,
} from '../features/fidoSlice'
import type {
  AppConfiguration,
  RootState,
  UpdateFidoAction,
  DeleteFido2DeviceAction,
  ErrorToastAction,
  ApiError,
} from '../../types'
import type { AuditLog } from '../../../../app/redux/sagas/types/audit'

import * as JansConfigApi from 'jans_config_api'

function* createFidoApi(): SagaIterator<FidoApi> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const configApi = new JansConfigApi.Fido2ConfigurationApi(getClient(JansConfigApi, token, issuer))
  const registrationApi = new JansConfigApi.Fido2RegistrationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new FidoApi(configApi, registrationApi)
}

function* errorToast({ error }: ErrorToastAction): SagaIterator<void> {
  yield put(
    updateToast(
      true,
      'error',
      error?.response?.data?.description || error?.response?.data?.message || error.message,
    ),
  )
}

export function* updateFidoSaga({
  payload,
}: UpdateFidoAction): SagaIterator<AppConfiguration | ApiError> {
  const audit: AuditLog = yield call(initAudit)
  try {
    const fidoApi: FidoApi = yield call(createFidoApi)
    const data: AppConfiguration = yield call(fidoApi.putPropertiesFido2, {
      appConfiguration: payload,
    })
    yield put(updateToast(true, 'success'))
    yield put(getFidoConfiguration())
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const error = e as ApiError
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(error)) {
      const jwt: string | null = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* getFidoSaga(): SagaIterator<AppConfiguration | ApiError> {
  const audit: AuditLog = yield call(initAudit)
  try {
    const fidoApi: FidoApi = yield call(createFidoApi)
    const data: AppConfiguration = yield call(fidoApi.getPropertiesFido2)
    yield put(getFidoConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const error = e as ApiError
    yield put(getFidoConfigurationResponse({} as AppConfiguration))
    if (isFourZeroOneError(error)) {
      const jwt: string | null = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* deleteFido2DeviceData({
  payload,
}: DeleteFido2DeviceAction): SagaIterator<void | ApiError> {
  const audit: AuditLog = yield call(initAudit)
  try {
    const fidoApi: FidoApi = yield call(createFidoApi)
    const data: void = yield call(fidoApi.deleteFido2DeviceData, payload)
    yield put(updateToast(true, 'success'))
    yield put(deleteFido2DeviceDataResponse())
    yield call(postUserAction, audit)
    return data
  } catch (error) {
    yield call(errorToast, { error: error as ApiError })
    yield put(deleteFido2DeviceDataResponse())
    return error as ApiError
  }
}

export function* watchGetFido(): SagaIterator<void> {
  yield takeEvery('fido2/getFidoConfiguration', getFidoSaga)
}

export function* watchUpdateFido(): SagaIterator<void> {
  yield takeLatest('fido2/putFidoConfiguration', updateFidoSaga)
}

export function* watchDeleteFido2DeviceData(): SagaIterator<void> {
  yield takeLatest('fido2/deleteFido2DeviceData', deleteFido2DeviceData)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchGetFido), fork(watchUpdateFido), fork(watchDeleteFido2DeviceData)])
}
