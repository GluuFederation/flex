import type { SagaIterator } from 'redux-saga'
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import * as JansConfigApi from 'jans_config_api'
import { handleTypedResponse } from 'Utils/ApiUtils'
import { addAdditionalData } from 'Utils/TokenController'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { FETCH } from '../../audit/UserActionType'
import { API_USERS } from '../../audit/Resources'
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import { isFourZeroThreeError } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
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
  new Promise<Record<string, JsonValue>>((resolve, reject) => {
    api.getUserByInum(inum, (error: Error | null, data?: Record<string, JsonValue>) => {
      handleTypedResponse<Record<string, JsonValue>>(error, reject, resolve, data)
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
    addAdditionalData(audit, FETCH, API_USERS, payload as Record<string, JsonValue>)
    const issuer: string | null = yield select(
      (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
    )
    const api = new JansConfigApi.ConfigurationUserManagementApi(
      getClient(JansConfigApi, null, issuer),
    )
    const data = yield call(fetchUserByInum, api, payload.pattern)
    yield put(setUserProfileDetails(data))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    yield put(setUserProfileDetails(null))
    if (isFourZeroThreeError(e as { status?: number })) {
      yield* redirectToLogout()
      return
    }
  } finally {
    yield put(checkIsLoadingDetails(false))
  }
}

export function* getProfileDetailsWatcher(): SagaIterator {
  yield takeLatest(getProfileDetails, getProfileDetailsWorker)
}

export default function* rootSaga(): SagaIterator {
  yield all([fork(getProfileDetailsWatcher)])
}
