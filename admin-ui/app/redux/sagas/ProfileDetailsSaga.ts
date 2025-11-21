import type { SagaIterator } from 'redux-saga'
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import * as JansConfigApi from 'jans_config_api'
import { handleTypedResponse } from 'Utils/ApiUtils'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { FETCH } from '../../audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { API_USERS } from '../../audit/Resources'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { postUserAction } from 'Redux/api/backend-api'
import {
  setUserProfileDetails,
  getProfileDetails,
  checkIsLoadingDetails,
  type ProfileDetailsRequestPayload,
} from '../features/ProfileDetailsSlice'
import { getClient } from 'Redux/api/base'

type ConfigurationUserManagementApi = InstanceType<
  typeof JansConfigApi.ConfigurationUserManagementApi
>

const fetchUserByInum = (api: ConfigurationUserManagementApi, inum: string) =>
  new Promise<Record<string, unknown>>((resolve, reject) => {
    api.getUserByInum(inum, (error: Error | null, data?: Record<string, unknown>) => {
      handleTypedResponse<Record<string, unknown>>(error, reject, resolve, data)
    })
  })

function* getProfileDetailsWorker({
  payload,
}: {
  payload: ProfileDetailsRequestPayload
}): SagaIterator {
  if (!payload?.pattern) {
    yield put(setUserProfileDetails(null))
    return
  }
  const audit = yield* initAudit()
  try {
    yield put(checkIsLoadingDetails(true))
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const token: string | undefined = yield select((state) => state.authReducer.token?.access_token)
    const issuer: string | undefined = yield select((state) => state.authReducer.issuer)
    const api = new JansConfigApi.ConfigurationUserManagementApi(
      getClient(JansConfigApi, token, issuer),
    )
    const data = yield call(fetchUserByInum, api, payload.pattern)
    yield put(setUserProfileDetails(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(setUserProfileDetails(null))
    if (isFourZeroOneError(e as { status?: number })) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  } finally {
    yield put(checkIsLoadingDetails(false))
  }
}

//watcher sagas
export function* getProfileDetailsWatcher(): SagaIterator {
  yield takeLatest(getProfileDetails, getProfileDetailsWorker)
}

export default function* rootSaga(): SagaIterator {
  yield all([fork(getProfileDetailsWatcher)])
}
