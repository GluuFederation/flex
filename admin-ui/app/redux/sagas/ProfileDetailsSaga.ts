import type { SagaIterator } from 'redux-saga'
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import * as JansConfigApi from 'jans_config_api'
import { handleTypedResponse } from 'Utils/ApiUtils'
import { addAdditionalData } from 'Utils/TokenController'
import { FETCH } from '../../audit/UserActionType'
import { API_USERS } from '../../audit/Resources'
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import { isFourZeroSixError } from 'Utils/TokenController'
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
    const issuer: string | undefined = yield select((state) => state.authReducer.issuer)
    const api = new JansConfigApi.ConfigurationUserManagementApi(
      getClient(JansConfigApi, null, issuer),
    )
    const data = yield call(fetchUserByInum, api, payload.pattern)
    yield put(setUserProfileDetails(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(setUserProfileDetails(null))
    if (isFourZeroSixError(e as { status?: number })) {
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
